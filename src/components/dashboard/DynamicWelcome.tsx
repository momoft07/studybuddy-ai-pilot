import { motion } from "framer-motion";
import { Flame, AlertTriangle, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface DynamicWelcomeProps {
  firstName: string;
  streakCount: number;
  weeklyHoursTarget: number;
  weeklyHoursCompleted: number;
  topTask?: { title: string; priority: string } | null;
}

export function DynamicWelcome({
  firstName,
  streakCount,
  weeklyHoursTarget,
  weeklyHoursCompleted,
  topTask,
}: DynamicWelcomeProps) {
  const hoursBehind = weeklyHoursTarget - weeklyHoursCompleted;
  const isBehind = hoursBehind > 0 && weeklyHoursCompleted < weeklyHoursTarget * 0.5;
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getStreakMessage = () => {
    if (streakCount === 0) return "Start your streak today!";
    if (streakCount === 1) return "1 day streak — great start!";
    if (streakCount < 7) return `${streakCount} days into your streak — keep going!`;
    if (streakCount < 30) return `🔥 ${streakCount}-day streak — you're on fire!`;
    return `🏆 ${streakCount}-day streak — legendary!`;
  };

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <h1 className="text-2xl font-display font-bold md:text-3xl">
          {getGreeting()}, <span className="gradient-text">{firstName}</span> 👋
        </h1>
        {streakCount >= 3 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Flame className="h-6 w-6 text-warning animate-pulse" />
          </motion.div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground"
      >
        {format(new Date(), "EEEE, MMMM d, yyyy")} • {getStreakMessage()}
      </motion.p>

      {isBehind ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-warning bg-warning/10 px-3 py-2 rounded-lg w-fit"
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">
            You're {hoursBehind.toFixed(1)} hours behind this week 😬 — Jump in now, even 20 minutes counts!
          </span>
        </motion.div>
      ) : topTask ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-2 rounded-lg w-fit"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm">
            Today's goal: {weeklyHoursTarget > 0 ? `${Math.ceil(weeklyHoursTarget / 7)} hours` : "Complete your tasks"} → Start with "{topTask.title}" ({topTask.priority} priority)
          </span>
        </motion.div>
      ) : null}
    </div>
  );
}
