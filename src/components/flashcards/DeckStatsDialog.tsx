import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  BarChart3,
  Flame,
} from "lucide-react";

interface DeckStats {
  dueToday: number;
  mastered: number;
  learning: number;
  masteryPercent: number;
}

interface DeckStatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deckName: string;
  cardCount: number;
  stats: DeckStats;
  createdAt?: string;
  lastStudied?: string;
}

export function DeckStatsDialog({
  isOpen,
  onClose,
  deckName,
  cardCount,
  stats,
  createdAt,
  lastStudied,
}: DeckStatsDialogProps) {
  const newCards = cardCount - stats.mastered - stats.learning;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Deck Statistics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Deck Info */}
          <div className="text-center pb-4 border-b border-border">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full gradient-accent mb-3">
              <Brain className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-lg">{deckName}</h3>
            <p className="text-sm text-muted-foreground">{cardCount} total cards</p>
          </div>

          {/* Mastery Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Mastery</span>
              <span className="text-sm font-bold text-primary">{stats.masteryPercent}%</span>
            </div>
            <Progress value={stats.masteryPercent} className="h-3" />
          </div>

          {/* Card Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-500">{stats.mastered}</p>
              <p className="text-xs text-muted-foreground">Mastered</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Target className="h-5 w-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-500">{stats.learning}</p>
              <p className="text-xs text-muted-foreground">Learning</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50 border border-border">
              <Brain className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-2xl font-bold">{newCards > 0 ? newCards : 0}</p>
              <p className="text-xs text-muted-foreground">New</p>
            </div>
          </div>

          {/* Due Today */}
          {stats.dueToday > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Due Today</span>
              </div>
              <Badge className="bg-primary">{stats.dueToday} cards</Badge>
            </div>
          )}

          {/* Study Streak Placeholder */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Study Streak</span>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            {createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {new Date(createdAt).toLocaleDateString()}
              </div>
            )}
            {lastStudied && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last studied: {new Date(lastStudied).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
