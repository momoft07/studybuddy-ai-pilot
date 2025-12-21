import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Brain,
  Plus,
  Play,
  Loader2,
  RotateCcw,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FlashcardDeck {
  id: string;
  name: string;
  description: string | null;
  card_count: number;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: "", description: "" });
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });

  useEffect(() => {
    if (user) {
      fetchDecks();
    }
  }, [user]);

  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from("flashcard_decks")
        .select("id, name, description, card_count")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDecks(data || []);
    } catch (error) {
      console.error("Error fetching decks:", error);
      toast.error("Failed to load flashcard decks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeck.name.trim()) {
      toast.error("Please enter a deck name");
      return;
    }

    try {
      const { error } = await supabase.from("flashcard_decks").insert({
        user_id: user?.id,
        name: newDeck.name,
        description: newDeck.description,
      });

      if (error) throw error;

      toast.success("Deck created!");
      setNewDeck({ name: "", description: "" });
      setIsCreateDeckOpen(false);
      fetchDecks();
    } catch (error) {
      console.error("Error creating deck:", error);
      toast.error("Failed to create deck");
    }
  };

  const handleAddCard = async () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    if (!selectedDeck) return;

    try {
      const { error } = await supabase.from("flashcards").insert({
        user_id: user?.id,
        deck_id: selectedDeck.id,
        question: newCard.question,
        answer: newCard.answer,
      });

      if (error) throw error;

      // Update card count
      await supabase
        .from("flashcard_decks")
        .update({ card_count: selectedDeck.card_count + 1 })
        .eq("id", selectedDeck.id);

      toast.success("Card added!");
      setNewCard({ question: "", answer: "" });
      setIsAddCardOpen(false);
      
      // Refresh the current cards if in study mode
      if (isStudyMode) {
        fetchCardsForDeck(selectedDeck.id);
      }
      fetchDecks();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    }
  };

  const fetchCardsForDeck = async (deckId: string) => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("id, question, answer")
        .eq("deck_id", deckId)
        .order("next_review_date", { ascending: true });

      if (error) throw error;
      setCurrentCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Failed to load cards");
    }
  };

  const startStudySession = async (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    await fetchCardsForDeck(deck.id);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsStudyMode(true);
  };

  const handleCardResponse = (correct: boolean) => {
    // TODO: Implement spaced repetition algorithm
    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      toast.success("Session complete! 🎉");
      setIsStudyMode(false);
      setSelectedDeck(null);
    }
  };

  if (isStudyMode && selectedDeck) {
    const currentCard = currentCards[currentCardIndex];

    if (currentCards.length === 0) {
      return (
        <AppLayout>
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <GlassCard className="p-8 text-center max-w-md">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No cards in this deck</h2>
              <p className="text-muted-foreground mb-4">
                Add some flashcards to start studying
              </p>
              <div className="flex gap-2">
                <GradientButton
                  variant="outline"
                  onClick={() => {
                    setIsStudyMode(false);
                    setSelectedDeck(null);
                  }}
                >
                  Back to Decks
                </GradientButton>
                <GradientButton onClick={() => setIsAddCardOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </GradientButton>
              </div>
            </GlassCard>

            {/* Add Card Dialog */}
            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
              <DialogContent className="glass-strong">
                <DialogHeader>
                  <DialogTitle>Add Flashcard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Question"
                    value={newCard.question}
                    onChange={(e) =>
                      setNewCard({ ...newCard, question: e.target.value })
                    }
                    rows={3}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={newCard.answer}
                    onChange={(e) =>
                      setNewCard({ ...newCard, answer: e.target.value })
                    }
                    rows={3}
                  />
                  <GradientButton onClick={handleAddCard} className="w-full">
                    Add Card
                  </GradientButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </AppLayout>
      );
    }

    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          {/* Progress */}
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {selectedDeck.name}
            </p>
            <p className="text-lg font-semibold">
              Card {currentCardIndex + 1} of {currentCards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div
            className={`relative w-full max-w-lg h-64 cursor-pointer perspective-1000`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <GlassCard
                variant="neon"
                className="absolute inset-0 flex items-center justify-center p-6 backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-xl text-center">{currentCard?.question}</p>
              </GlassCard>

              {/* Back */}
              <GlassCard
                className="absolute inset-0 flex items-center justify-center p-6 gradient-primary"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="text-xl text-center text-primary-foreground">
                  {currentCard?.answer}
                </p>
              </GlassCard>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4 mb-6">
            {isFlipped ? "Did you get it right?" : "Tap to reveal answer"}
          </p>

          {/* Actions */}
          {isFlipped && (
            <div className="flex gap-4">
              <GradientButton
                variant="outline"
                onClick={() => handleCardResponse(false)}
                className="gap-2"
              >
                <X className="h-5 w-5" />
                Wrong
              </GradientButton>
              <GradientButton
                onClick={() => handleCardResponse(true)}
                className="gap-2"
              >
                <Check className="h-5 w-5" />
                Correct
              </GradientButton>
            </div>
          )}

          <GradientButton
            variant="ghost"
            className="mt-8"
            onClick={() => {
              setIsStudyMode(false);
              setSelectedDeck(null);
            }}
          >
            Exit Study Mode
          </GradientButton>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold md:text-3xl">
              <span className="gradient-text">Flashcards</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Master concepts with spaced repetition
            </p>
          </div>
          <Dialog open={isCreateDeckOpen} onOpenChange={setIsCreateDeckOpen}>
            <DialogTrigger asChild>
              <GradientButton>
                <Plus className="mr-2 h-4 w-4" />
                New Deck
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Create New Deck</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Deck name"
                  value={newDeck.name}
                  onChange={(e) =>
                    setNewDeck({ ...newDeck, name: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newDeck.description}
                  onChange={(e) =>
                    setNewDeck({ ...newDeck, description: e.target.value })
                  }
                  rows={3}
                />
                <GradientButton onClick={handleCreateDeck} className="w-full">
                  Create Deck
                </GradientButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Decks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : decks.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No flashcard decks yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first deck to start studying
            </p>
            <GradientButton onClick={() => setIsCreateDeckOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Deck
            </GradientButton>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <GlassCard key={deck.id} hover className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg gradient-accent p-1.5">
                      <Brain className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold">{deck.name}</h3>
                  </div>
                </div>
                {deck.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {deck.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-4">
                  {deck.card_count} cards
                </p>
                <div className="flex gap-2">
                  <GradientButton
                    size="sm"
                    className="flex-1"
                    onClick={() => startStudySession(deck)}
                  >
                    <Play className="mr-1 h-4 w-4" />
                    Study
                  </GradientButton>
                  <GradientButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDeck(deck);
                      setIsAddCardOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </GradientButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Add Card Dialog */}
        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle>
                Add Card to {selectedDeck?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="Question"
                value={newCard.question}
                onChange={(e) =>
                  setNewCard({ ...newCard, question: e.target.value })
                }
                rows={3}
              />
              <Textarea
                placeholder="Answer"
                value={newCard.answer}
                onChange={(e) =>
                  setNewCard({ ...newCard, answer: e.target.value })
                }
                rows={3}
              />
              <GradientButton onClick={handleAddCard} className="w-full">
                Add Card
              </GradientButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
