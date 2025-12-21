import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Brain,
  MoreVertical,
  Play,
  Plus,
  Trash2,
  Edit,
  Copy,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  Eye,
  BarChart3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";

interface FlashcardDeck {
  id: string;
  name: string;
  description: string | null;
  card_count: number;
  created_at?: string;
  updated_at?: string;
}

interface DeckStats {
  dueToday: number;
  mastered: number;
  learning: number;
  masteryPercent: number;
}

interface DeckCardProps {
  deck: FlashcardDeck;
  stats: DeckStats;
  onStudy: () => void;
  onAddCard: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onViewStats: () => void;
}

function getRelativeTime(dateString?: string): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function DeckCard({ 
  deck, 
  stats,
  onStudy, 
  onAddCard,
  onEdit,
  onDuplicate,
  onDelete,
  onPreview,
  onViewStats,
}: DeckCardProps) {
  const lastStudied = getRelativeTime(deck.updated_at);
  const hasDueCards = stats.dueToday > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard 
        hover 
        className="relative group focus-within:ring-2 focus-within:ring-primary/50 transition-all"
        tabIndex={0}
        role="article"
        aria-label={`Deck: ${deck.name}`}
      >
        {/* Due badge */}
        {hasDueCards && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-amber-500 text-amber-950 shadow-lg animate-pulse">
              <Calendar className="h-3 w-3 mr-1" />
              {stats.dueToday} due
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="rounded-lg gradient-accent p-1.5 shrink-0">
              <Brain className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
            </div>
            <h3 className="font-semibold line-clamp-1 text-sm md:text-base">{deck.name}</h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                aria-label="Deck actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onPreview} className="gap-2">
                <Eye className="h-4 w-4" />
                View Cards
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewStats} className="gap-2">
                <BarChart3 className="h-4 w-4" />
                View Stats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Deck
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddCard} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Cards
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate} className="gap-2">
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" disabled>
                <Sparkles className="h-4 w-4" />
                Generate with AI
                <Badge variant="outline" className="ml-auto text-[10px] px-1">Pro</Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Deck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {deck.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {deck.description}
          </p>
        )}

        {/* Stats badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs gap-1">
            <Target className="h-3 w-3" />
            {deck.card_count} cards
          </Badge>
          <Badge variant="outline" className="text-xs gap-1 text-green-500 border-green-500/30">
            <TrendingUp className="h-3 w-3" />
            {stats.mastered} mastered
          </Badge>
          {stats.learning > 0 && (
            <Badge variant="outline" className="text-xs gap-1 text-amber-500 border-amber-500/30">
              📚 {stats.learning} learning
            </Badge>
          )}
        </div>

        {/* Mastery progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Mastery</span>
            <span className="font-medium text-primary">{stats.masteryPercent}%</span>
          </div>
          <Progress value={stats.masteryPercent} className="h-1.5" />
        </div>

        {/* Last studied */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Clock className="h-3 w-3" />
          <span>Last studied {lastStudied}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <GradientButton
            size="sm"
            className="flex-1"
            onClick={onStudy}
          >
            <Play className="mr-1 h-4 w-4" />
            {hasDueCards ? `Study (${stats.dueToday} due)` : "Study"}
          </GradientButton>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddCard}
            aria-label="Add card"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
