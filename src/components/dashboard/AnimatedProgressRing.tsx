import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Trophy, Zap, Star, PartyPopper } from "lucide-react";

interface AnimatedProgressRingProps {
  value: number;
  completedTasks: number;
  totalTasks: number;
}

export function AnimatedProgressRing({
  value,
  completedTasks,
  totalTasks,
}: AnimatedProgressRingProps) {
  const [milestone, setMilestone] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState(0);

  useEffect(() => {
    // Check for milestone crossings
    const milestones = [
      { threshold: 25, message: "You're quarter-way there! 💪", icon: "zap" },
      { threshold: 50, message: "Halfway! Keep crushing it! 🚀", icon: "star" },
      { threshold: 75, message: "Almost there! Final push! 🔥", icon: "trophy" },
      { threshold: 100, message: "All done! Treat yourself! 🎉", icon: "party" },
    ];

    for (const m of milestones) {
      if (prevValue < m.threshold && value >= m.threshold) {
        setMilestone(m.message);
        setTimeout(() => setMilestone(null), 3000);
        break;
      }
    }

    setPrevValue(value);
  }, [value, prevValue]);

  const getMilestoneIcon = () => {
    if (value >= 100) return <PartyPopper className="h-5 w-5 text-success" />;
    if (value >= 75) return <Trophy className="h-5 w-5 text-warning" />;
    if (value >= 50) return <Star className="h-5 w-5 text-primary" />;
    if (value >= 25) return <Zap className="h-5 w-5 text-accent" />;
    return null;
  };

  const getMessage = () => {
    if (value === 100) return "Amazing! You've completed all tasks! 🎉";
    if (value >= 75) return "Almost there! Final push! 🔥";
    if (value >= 50) return "Halfway! Keep crushing it! 🚀";
    if (value >= 25) return "You're quarter-way there! 💪";
    return "Let's get started! 🚀";
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <h2 className="text-lg font-semibold mb-4">Today's Progress</h2>
      
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <ProgressRing 
            value={value} 
            size={160} 
            strokeWidth={12}
            variant={value >= 100 ? "teal" : value >= 50 ? "accent" : "primary"}
          >
            <span className="text-xs text-muted-foreground mt-1">
              {completedTasks}/{totalTasks} tasks
            </span>
          </ProgressRing>
        </motion.div>

        {/* Milestone icon */}
        <AnimatePresence>
          {getMilestoneIcon() && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2"
            >
              {getMilestoneIcon()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Milestone notification */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
          >
            {milestone}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p 
        key={getMessage()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-sm text-muted-foreground text-center"
      >
        {getMessage()}
      </motion.p>
    </div>
  );
}
