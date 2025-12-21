import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  correct_count: number | null;
  review_count: number | null;
}

interface DeckPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
  deckName: string;
  userId: string;
  onCardsUpdated: () => void;
}

export function DeckPreviewDialog({
  isOpen,
  onClose,
  deckId,
  deckName,
  userId,
  onCardsUpdated,
}: DeckPreviewDialogProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("id, question, answer, correct_count, review_count")
        .eq("deck_id", deckId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error("Error fetching cards:", err);
      toast.error("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      fetchCards();
    } else {
      onClose();
      setSearchQuery("");
      setEditingCard(null);
      setIsAddingCard(false);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    try {
      const { error } = await supabase.from("flashcards").insert({
        user_id: userId,
        deck_id: deckId,
        question: newCard.question,
        answer: newCard.answer,
      });

      if (error) throw error;

      toast.success("Card added!");
      setNewCard({ question: "", answer: "" });
      setIsAddingCard(false);
      fetchCards();
      onCardsUpdated();
    } catch (err) {
      console.error("Error adding card:", err);
      toast.error("Failed to add card");
    }
  };

  const handleEditCard = async (cardId: string) => {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("flashcards")
        .update({ question: editForm.question, answer: editForm.answer })
        .eq("id", cardId);

      if (error) throw error;

      toast.success("Card updated!");
      setEditingCard(null);
      fetchCards();
    } catch (err) {
      console.error("Error updating card:", err);
      toast.error("Failed to update card");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase.from("flashcards").delete().eq("id", cardId);

      if (error) throw error;

      toast.success("Card deleted");
      setCards(cards.filter((c) => c.id !== cardId));
      onCardsUpdated();
    } catch (err) {
      console.error("Error deleting card:", err);
      toast.error("Failed to delete card");
    }
  };

  const filteredCards = cards.filter(
    (card) =>
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMasteryBadge = (card: Flashcard) => {
    const correct = card.correct_count || 0;
    if (correct >= 5) return { label: "Mastered", variant: "default" as const, className: "bg-green-500" };
    if (correct >= 3) return { label: "Learning", variant: "secondary" as const, className: "bg-amber-500" };
    if ((card.review_count || 0) > 0) return { label: "Reviewing", variant: "outline" as const, className: "" };
    return { label: "New", variant: "outline" as const, className: "" };
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogContent className="glass-strong max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            {deckName}
            <Badge variant="secondary" className="ml-2">
              {cards.length} cards
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search & Add */}
        <div className="flex gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <GradientButton onClick={() => setIsAddingCard(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </GradientButton>
        </div>

        {/* Add Card Form */}
        <AnimatePresence>
          {isAddingCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-lg p-4 bg-muted/30 space-y-3"
            >
              <Input
                placeholder="Question"
                value={newCard.question}
                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
              />
              <Textarea
                placeholder="Answer"
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsAddingCard(false)}>
                  Cancel
                </Button>
                <GradientButton size="sm" onClick={handleAddCard}>
                  Add Card
                </GradientButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards List */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {cards.length === 0 ? "No cards yet. Add your first card!" : "No cards match your search."}
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <AnimatePresence>
                {filteredCards.map((card, index) => {
                  const mastery = getMasteryBadge(card);
                  const isExpanded = expandedCard === card.id;
                  const isEditing = editingCard === card.id;

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className="border rounded-lg overflow-hidden"
                    >
                      {isEditing ? (
                        <div className="p-4 space-y-3 bg-muted/30">
                          <Input
                            value={editForm.question}
                            onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                            placeholder="Question"
                          />
                          <Textarea
                            value={editForm.answer}
                            onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                            placeholder="Answer"
                            rows={2}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setEditingCard(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleEditCard(card.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <ChevronRight
                                className={`h-4 w-4 mt-1 shrink-0 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-1">{card.question}</p>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.p
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap"
                                    >
                                      {card.answer}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant={mastery.variant} className={`text-[10px] ${mastery.className}`}>
                                {mastery.label}
                              </Badge>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditForm({ question: card.question, answer: card.answer });
                                    setEditingCard(card.id);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCard(card.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
