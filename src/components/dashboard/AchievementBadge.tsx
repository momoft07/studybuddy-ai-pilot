import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Target, Brain, Trophy, Star, Zap } from "lucide-react";

interface Achievement {
  id: string;
  icon: typeof Flame;
  title: string;
  description: string;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "streak-7",
    icon: Flame,
    title: "7-Day Streak!",
    description: "You've studied 7 days in a row",
    color: "text-warning",
  },
  {
    id: "streak-30",
    icon: Trophy,
    title: "Monthly Master!",
    description: "30-day study streak achieved",
    color: "text-warning",
  },
  {
    id: "weekly-goal",
    icon: Target,
    title: "Weekly Goal Achieved!",
    description: "You hit your study target",
    color: "text-success",
  },
  {
    id: "flashcards-100",
    icon: Brain,
    title: "Memory Master!",
    description: "100 flashcards reviewed",
    color: "text-accent",
  },
  {
    id: "first-plan",
    icon: Star,
    title: "Planning Pro!",
    description: "Created your first study plan",
    color: "text-primary",
  },
  {
    id: "focus-session",
    icon: Zap,
    title: "Focus Champion!",
    description: "Completed 10 focus sessions",
    color: "text-secondary",
  },
];

interface AchievementBadgeProps {
  streakCount: number;
  goalsHit: number;
  flashcardsReviewed: number;
  focusSessions: number;
  hasStudyPlan: boolean;
}

export function AchievementBadge({
  streakCount,
  goalsHit,
  flashcardsReviewed,
  focusSessions,
  hasStudyPlan,
}: AchievementBadgeProps) {
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [shownAchievements, setShownAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load shown achievements from localStorage
    const stored = localStorage.getItem("studypilot-achievements");
    if (stored) {
      setShownAchievements(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    const checkAchievements = () => {
      const earned: Achievement[] = [];

      if (streakCount >= 7 && !shownAchievements.has("streak-7")) {
        earned.push(ACHIEVEMENTS.find((a) => a.id === "streak-7")!);
      }
      if (streakCount >= 30 && !shownAchievements.has("streak-30")) {
        earned.push(ACHIEVEMENTS.find((a) => a.id === "streak-30")!);
      }
      if (goalsHit >= 100 && !shownAchievements.has("weekly-goal")) {
        earned.push(ACHIEVEMENTS.find((a) => a.id === "weekly-goal")!);
      }
      if (flashcardsReviewed >= 100 && !shownAchievements.has("flashcards-100")) {
        earned.push(ACHIEVEMENTS.find((a) => a.id === "flashcards-100")!);
      }
      if (hasStudyPlan && !shownAchievements.has("first-plan")) {
        earned.push(ACHIEVEMENTS.find((a) => a.id === "first-plan")!);
      }
      if (focusSessions >= 10 && !shownAchievements.has("focus-session")) {
        earned.push(ACHIEVEMENTS.find((a) => a.id === "focus-session")!);
      }

      if (earned.length > 0) {
        showAchievementSequence(earned);
      }
    };

    const timeout = setTimeout(checkAchievements, 1000);
    return () => clearTimeout(timeout);
  }, [streakCount, goalsHit, flashcardsReviewed, focusSessions, hasStudyPlan, shownAchievements]);

  const showAchievementSequence = (achievements: Achievement[]) => {
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        setShowAchievement(achievement);
        setShownAchievements((prev) => {
          const newSet = new Set(prev);
          newSet.add(achievement.id);
          localStorage.setItem("studypilot-achievements", JSON.stringify([...newSet]));
          return newSet;
        });

        setTimeout(() => setShowAchievement(null), 4000);
      }, index * 5000);
    });
  };

  return (
    <AnimatePresence>
      {showAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-strong px-6 py-4 rounded-2xl flex items-center gap-4 glow-primary">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`p-3 rounded-xl bg-muted/50 ${showAchievement.color}`}
            >
              <showAchievement.icon className="h-8 w-8" />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="font-bold text-lg"
              >
                🏆 {showAchievement.title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground"
              >
                {showAchievement.description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
