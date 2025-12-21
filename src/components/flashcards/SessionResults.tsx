import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp, 
  Home,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface SessionResultsProps {
  deckName: string;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  onClose: () => void;
  onStudyAgain: () => void;
}

export function SessionResults({
  deckName,
  totalCards,
  correctCount,
  incorrectCount,
  onClose,
  onStudyAgain,
}: SessionResultsProps) {
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
  const isPerfect = accuracy === 100;
  const isGreat = accuracy >= 80;

  useEffect(() => {
    if (isPerfect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (isGreat) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  }, [isPerfect, isGreat]);

  const getMessage = () => {
    if (isPerfect) return { emoji: "🎉", text: "Perfect Score!", subtext: "You're a genius!" };
    if (accuracy >= 80) return { emoji: "🔥", text: "Great Job!", subtext: "Keep up the momentum!" };
    if (accuracy >= 60) return { emoji: "💪", text: "Good Progress!", subtext: "Practice makes perfect." };
    if (accuracy >= 40) return { emoji: "📚", text: "Keep Going!", subtext: "You're learning." };
    return { emoji: "🌱", text: "Room to Grow!", subtext: "Don't give up!" };
  };

  const message = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <GlassCard className="p-8 text-center">
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mx-auto mb-6"
        >
          <div className="text-6xl">{message.emoji}</div>
        </motion.div>

        <h2 className="text-2xl font-bold mb-1">{message.text}</h2>
        <p className="text-muted-foreground mb-6">{message.subtext}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-lg bg-muted/30"
          >
            <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold">{totalCards}</p>
            <p className="text-xs text-muted-foreground">Reviewed</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 rounded-lg bg-green-500/10"
          >
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-xl font-bold text-green-500">{correctCount}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 rounded-lg bg-red-500/10"
          >
            <Flame className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <p className="text-xl font-bold text-red-500">{incorrectCount}</p>
            <p className="text-xs text-muted-foreground">To Review</p>
          </motion.div>
        </div>

        {/* Accuracy Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Accuracy</span>
            <Badge 
              className={`${
                accuracy >= 80 ? "bg-green-500" : 
                accuracy >= 60 ? "bg-amber-500" : 
                "bg-red-500"
              }`}
            >
              {accuracy}%
            </Badge>
          </div>
          <Progress value={accuracy} className="h-2" />
        </motion.div>

        {/* Deck Info */}
        <p className="text-sm text-muted-foreground mb-6">
          Session completed for "{deckName}"
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <GradientButton variant="outline" onClick={onClose} className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Back to Decks
          </GradientButton>
          <GradientButton onClick={onStudyAgain} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Study Again
          </GradientButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}
