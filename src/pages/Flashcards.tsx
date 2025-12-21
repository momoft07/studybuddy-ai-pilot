import { useState, useEffect, useMemo } from "react";
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
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import { DeckCard } from "@/components/flashcards/DeckCard";
import { DeckSkeletonGrid } from "@/components/flashcards/DeckSkeleton";
import { EmptyDecksState } from "@/components/flashcards/EmptyDecksState";
import { FlashcardsErrorState } from "@/components/flashcards/FlashcardsErrorState";
import { DecksSearch, SortOption } from "@/components/flashcards/DecksSearch";
import { DeleteDeckDialog } from "@/components/flashcards/DeleteDeckDialog";
import { StudyModeDialog, StudyMode } from "@/components/flashcards/StudyModeDialog";

interface FlashcardDeck {
  id: string;
  name: string;
  description: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  correct_count: number | null;
  review_count: number | null;
  next_review_date: string | null;
}

interface DeckStats {
  dueToday: number;
  mastered: number;
  learning: number;
  masteryPercent: number;
}

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: "", description: "" });
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; deck: FlashcardDeck | null }>({
    isOpen: false,
    deck: null,
  });
  const [studyModeDialog, setStudyModeDialog] = useState<{ isOpen: boolean; deck: FlashcardDeck | null }>({
    isOpen: false,
    deck: null,
  });
  const [deckStats, setDeckStats] = useState<Record<string, DeckStats>>({});

  useEffect(() => {
    if (user) {
      fetchDecks();
    }
  }, [user]);

  const fetchDecks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("flashcard_decks")
        .select("id, name, description, card_count, created_at, updated_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDecks(data || []);
      
      // Fetch stats for each deck
      if (data && data.length > 0) {
        fetchDeckStats(data.map(d => d.id));
      }
    } catch (err) {
      console.error("Error fetching decks:", err);
      setError("Failed to load flashcard decks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeckStats = async (deckIds: string[]) => {
    try {
      const { data: cards, error } = await supabase
        .from("flashcards")
        .select("deck_id, correct_count, review_count, next_review_date")
        .in("deck_id", deckIds);

      if (error) throw error;

      const stats: Record<string, DeckStats> = {};
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      deckIds.forEach(deckId => {
        const deckCards = cards?.filter(c => c.deck_id === deckId) || [];
        const mastered = deckCards.filter(c => (c.correct_count || 0) >= 3).length;
        const dueToday = deckCards.filter(c => {
          if (!c.next_review_date) return true;
          return new Date(c.next_review_date) <= today;
        }).length;
        
        stats[deckId] = {
          dueToday,
          mastered,
          learning: deckCards.length - mastered,
          masteryPercent: deckCards.length > 0 ? Math.round((mastered / deckCards.length) * 100) : 0,
        };
      });

      setDeckStats(stats);
    } catch (err) {
      console.error("Error fetching deck stats:", err);
    }
  };

  const filteredAndSortedDecks = useMemo(() => {
    let result = decks.filter(deck =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "cards":
          return b.card_count - a.card_count;
        case "studied":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "created":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [decks, searchQuery, sortBy]);

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

      toast.success("Deck created successfully!");
      setNewDeck({ name: "", description: "" });
      setIsCreateDeckOpen(false);
      fetchDecks();
    } catch (err) {
      console.error("Error creating deck:", err);
      toast.error("Failed to create deck");
    }
  };

  const handleDeleteDeck = async () => {
    if (!deleteDialog.deck) return;
    
    const deckId = deleteDialog.deck.id;
    setDeleteDialog({ isOpen: false, deck: null });

    try {
      // Delete all cards first
      await supabase.from("flashcards").delete().eq("deck_id", deckId);
      
      // Then delete the deck
      const { error } = await supabase.from("flashcard_decks").delete().eq("id", deckId);

      if (error) throw error;

      toast.success("Deck deleted", {
        description: "The deck and all its cards have been removed.",
      });
      setDecks(decks.filter(d => d.id !== deckId));
    } catch (err) {
      console.error("Error deleting deck:", err);
      toast.error("Failed to delete deck");
    }
  };

  const handleDuplicateDeck = async (deck: FlashcardDeck) => {
    try {
      // Create new deck
      const { data: newDeckData, error: deckError } = await supabase
        .from("flashcard_decks")
        .insert({
          user_id: user?.id,
          name: `${deck.name} (Copy)`,
          description: deck.description,
        })
        .select()
        .single();

      if (deckError) throw deckError;

      // Copy all cards
      const { data: cards, error: cardsError } = await supabase
        .from("flashcards")
        .select("question, answer")
        .eq("deck_id", deck.id);

      if (cardsError) throw cardsError;

      if (cards && cards.length > 0) {
        const newCards = cards.map(card => ({
          user_id: user?.id,
          deck_id: newDeckData.id,
          question: card.question,
          answer: card.answer,
        }));

        await supabase.from("flashcards").insert(newCards);
        await supabase
          .from("flashcard_decks")
          .update({ card_count: cards.length })
          .eq("id", newDeckData.id);
      }

      toast.success("Deck duplicated!");
      fetchDecks();
    } catch (err) {
      console.error("Error duplicating deck:", err);
      toast.error("Failed to duplicate deck");
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

      await supabase
        .from("flashcard_decks")
        .update({ card_count: selectedDeck.card_count + 1 })
        .eq("id", selectedDeck.id);

      toast.success("Card added!");
      setNewCard({ question: "", answer: "" });
      setIsAddCardOpen(false);
      
      if (isStudyMode) {
        fetchCardsForDeck(selectedDeck.id);
      }
      fetchDecks();
    } catch (err) {
      console.error("Error adding card:", err);
      toast.error("Failed to add card");
    }
  };

  const fetchCardsForDeck = async (deckId: string) => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("id, question, answer, correct_count, review_count, next_review_date")
        .eq("deck_id", deckId)
        .order("next_review_date", { ascending: true });

      if (error) throw error;
      setCurrentCards(data || []);
    } catch (err) {
      console.error("Error fetching cards:", err);
      toast.error("Failed to load cards");
    }
  };

  const handleSelectStudyMode = async (mode: StudyMode) => {
    if (!studyModeDialog.deck) return;
    
    const deck = studyModeDialog.deck;
    setStudyModeDialog({ isOpen: false, deck: null });
    setSelectedDeck(deck);
    await fetchCardsForDeck(deck.id);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsStudyMode(true);
  };

  const handleCardResponse = async (correct: boolean) => {
    const currentCard = currentCards[currentCardIndex];
    
    // Update card stats
    try {
      const newReviewCount = (currentCard.review_count || 0) + 1;
      const newCorrectCount = correct ? (currentCard.correct_count || 0) + 1 : (currentCard.correct_count || 0);
      
      // Simple SRS: if correct, schedule further out
      const daysUntilNext = correct ? Math.min(newCorrectCount * 2, 30) : 1;
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + daysUntilNext);

      await supabase
        .from("flashcards")
        .update({
          review_count: newReviewCount,
          correct_count: newCorrectCount,
          next_review_date: nextReview.toISOString(),
        })
        .eq("id", currentCard.id);
    } catch (err) {
      console.error("Error updating card:", err);
    }

    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      toast.success("Session complete! 🎉", {
        description: `You reviewed ${currentCards.length} cards.`,
      });
      setIsStudyMode(false);
      setSelectedDeck(null);
      fetchDecks(); // Refresh stats
    }
  };

  // Study mode view
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
              <div className="flex gap-2 justify-center">
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

            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
              <DialogContent className="glass-strong">
                <DialogHeader>
                  <DialogTitle>Add Flashcard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Question"
                    value={newCard.question}
                    onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                    rows={3}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={newCard.answer}
                    onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
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
            <p className="text-sm text-muted-foreground mb-2">{selectedDeck.name}</p>
            <p className="text-lg font-semibold">
              Card {currentCardIndex + 1} of {currentCards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div
            className="relative w-full max-w-lg h-64 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            role="button"
            aria-label={isFlipped ? "Click to see question" : "Click to reveal answer"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setIsFlipped(!isFlipped)}
          >
            <div
              className="w-full h-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <GlassCard
                variant="neon"
                className="absolute inset-0 flex items-center justify-center p-6"
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

  // Main deck list view
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-display font-bold md:text-2xl flex items-center gap-2">
              <Brain className="h-6 w-6 text-accent" aria-hidden="true" />
              <span className="gradient-text">Flashcards</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Master concepts with spaced repetition
            </p>
          </div>
          <Dialog open={isCreateDeckOpen} onOpenChange={setIsCreateDeckOpen}>
            <DialogTrigger asChild>
              <GradientButton className="w-full md:w-auto">
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
                  onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                  aria-label="Deck name"
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  rows={3}
                  aria-label="Deck description"
                />
                <GradientButton onClick={handleCreateDeck} className="w-full">
                  Create Deck
                </GradientButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Sort */}
        {decks.length > 0 && (
          <DecksSearch
            value={searchQuery}
            onChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={filteredAndSortedDecks.length}
            totalCount={decks.length}
          />
        )}

        {/* Content */}
        {loading ? (
          <DeckSkeletonGrid />
        ) : error ? (
          <FlashcardsErrorState error={error} onRetry={fetchDecks} />
        ) : decks.length === 0 ? (
          <EmptyDecksState onCreateDeck={() => setIsCreateDeckOpen(true)} />
        ) : filteredAndSortedDecks.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No decks found</h3>
            <p className="text-muted-foreground mb-4">
              No decks matching "{searchQuery}" were found.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline text-sm font-medium"
            >
              Clear search
            </button>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  stats={deckStats[deck.id] || { dueToday: 0, mastered: 0, learning: 0, masteryPercent: 0 }}
                  onStudy={() => setStudyModeDialog({ isOpen: true, deck })}
                  onAddCard={() => {
                    setSelectedDeck(deck);
                    setIsAddCardOpen(true);
                  }}
                  onEdit={() => toast.info("Edit feature coming soon!")}
                  onDuplicate={() => handleDuplicateDeck(deck)}
                  onDelete={() => setDeleteDialog({ isOpen: true, deck })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add Card Dialog */}
        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle>Add Card to {selectedDeck?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="Question"
                value={newCard.question}
                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                rows={3}
                aria-label="Card question"
              />
              <Textarea
                placeholder="Answer"
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                rows={3}
                aria-label="Card answer"
              />
              <GradientButton onClick={handleAddCard} className="w-full">
                Add Card
              </GradientButton>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteDeckDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, deck: null })}
          onConfirm={handleDeleteDeck}
          deckName={deleteDialog.deck?.name || ""}
          cardCount={deleteDialog.deck?.card_count || 0}
        />

        {/* Study Mode Selection Dialog */}
        <StudyModeDialog
          isOpen={studyModeDialog.isOpen}
          onClose={() => setStudyModeDialog({ isOpen: false, deck: null })}
          onSelectMode={handleSelectStudyMode}
          deckName={studyModeDialog.deck?.name || ""}
          dueCards={deckStats[studyModeDialog.deck?.id || ""]?.dueToday || 0}
          totalCards={studyModeDialog.deck?.card_count || 0}
        />
      </div>
    </AppLayout>
  );
}
