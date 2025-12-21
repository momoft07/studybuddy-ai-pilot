import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { Sparkles, Loader2, Check, AlertCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneratedCard {
  question: string;
  answer: string;
  selected: boolean;
}

interface AIGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
  deckName: string;
  userId: string;
  onCardsAdded: () => void;
}

export function AIGeneratorDialog({
  open,
  onOpenChange,
  deckId,
  deckName,
  userId,
  onCardsAdded,
}: AIGeneratorDialogProps) {
  const [text, setText] = useState("");
  const [cardCount, setCardCount] = useState([5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<"input" | "review">("input");

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to generate flashcards from");
      return;
    }

    if (text.trim().length < 50) {
      toast.error("Please provide more text (at least 50 characters)");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-flashcards", {
        body: { text: text.trim(), count: cardCount[0] },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate flashcards");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const cards = data.flashcards.map((card: { question: string; answer: string }) => ({
        ...card,
        selected: true,
      }));

      setGeneratedCards(cards);
      setStep("review");
      toast.success(`Generated ${cards.length} flashcards!`);
    } catch (err) {
      console.error("Generation error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to generate flashcards");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCard = (index: number) => {
    setGeneratedCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, selected: !card.selected } : card
      )
    );
  };

  const handleSaveCards = async () => {
    const selectedCards = generatedCards.filter((c) => c.selected);
    if (selectedCards.length === 0) {
      toast.error("Please select at least one card to add");
      return;
    }

    setIsSaving(true);

    try {
      const cardsToInsert = selectedCards.map((card) => ({
        user_id: userId,
        deck_id: deckId,
        question: card.question,
        answer: card.answer,
      }));

      const { error: insertError } = await supabase
        .from("flashcards")
        .insert(cardsToInsert);

      if (insertError) throw insertError;

      // Update deck card count
      const { data: currentDeck } = await supabase
        .from("flashcard_decks")
        .select("card_count")
        .eq("id", deckId)
        .single();

      await supabase
        .from("flashcard_decks")
        .update({ card_count: (currentDeck?.card_count || 0) + selectedCards.length })
        .eq("id", deckId);

      toast.success(`Added ${selectedCards.length} cards to ${deckName}!`);
      onCardsAdded();
      handleClose();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save flashcards");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setText("");
    setGeneratedCards([]);
    setStep("input");
    setCardCount([5]);
    onOpenChange(false);
  };

  const selectedCount = generatedCards.filter((c) => c.selected).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Flashcard Generator
          </DialogTitle>
          <DialogDescription>
            {step === "input"
              ? "Paste your notes or study material to generate flashcards automatically"
              : `Review and select which cards to add to "${deckName}"`}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "input" ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 flex-1"
            >
              <div className="space-y-2">
                <Label htmlFor="source-text">Source Text</Label>
                <Textarea
                  id="source-text"
                  placeholder="Paste your notes, textbook content, or any study material here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {text.length} characters
                  </span>
                  {text.length > 0 && text.length < 50 && (
                    <span className="text-amber-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Need at least 50 characters
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Number of cards</Label>
                  <Badge variant="secondary">{cardCount[0]} cards</Badge>
                </div>
                <Slider
                  value={cardCount}
                  onValueChange={setCardCount}
                  min={3}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>

              <GradientButton
                onClick={handleGenerate}
                disabled={isGenerating || text.trim().length < 50}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Flashcards
                  </>
                )}
              </GradientButton>
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {selectedCount} of {generatedCards.length} cards selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setGeneratedCards((prev) =>
                      prev.map((c) => ({ ...c, selected: true }))
                    )
                  }
                >
                  Select All
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[350px]">
                {generatedCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleCard(index)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      card.selected
                        ? "border-primary bg-primary/5"
                        : "border-border/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          card.selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {card.selected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1 line-clamp-2">
                          Q: {card.question}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          A: {card.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep("input")}
                  className="flex-1"
                >
                  Back
                </Button>
                <GradientButton
                  onClick={handleSaveCards}
                  disabled={isSaving || selectedCount === 0}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Add {selectedCount} Cards
                    </>
                  )}
                </GradientButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
