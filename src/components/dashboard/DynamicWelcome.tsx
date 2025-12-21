import { motion } from "framer-motion";
import { Flame, AlertTriangle, Sparkles, PartyPopper, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";

interface DynamicWelcomeProps {
  firstName: string;
  streakCount: number;
  weeklyHoursTarget: number;
  weeklyHoursCompleted: number;
  topTask?: { title: string; priority: string } | null;
  completedTasksToday: number;
  totalTasksToday: number;
}

export function DynamicWelcome({
  firstName,
  streakCount,
  weeklyHoursTarget,
  weeklyHoursCompleted,
  topTask,
  completedTasksToday,
  totalTasksToday,
}: DynamicWelcomeProps) {
  const hoursRemaining = Math.max(0, weeklyHoursTarget - weeklyHoursCompleted);
  const weekProgress = weeklyHoursTarget > 0 ? (weeklyHoursCompleted / weeklyHoursTarget) * 100 : 0;
  const allTasksDone = totalTasksToday > 0 && completedTasksToday === totalTasksToday;
  const noTasks = totalTasksToday === 0;
  
  // Calculate if actually behind (based on day of week)
  const dayOfWeek = new Date().getDay();
  const daysIntoWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday = 7
  const expectedProgress = (daysIntoWeek / 7) * 100;
  const isBehind = weekProgress < expectedProgress - 15 && weeklyHoursCompleted < weeklyHoursTarget;
  
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

  const getContextMessage = () => {
    // All tasks completed today
    if (allTasksDone) {
      return {
        type: "success" as const,
        icon: PartyPopper,
        message: `Amazing! All ${totalTasksToday} tasks completed today! 🎉 ${weekProgress >= 100 ? "Weekly goal crushed too!" : ""}`,
      };
    }

    // Weekly goal achieved
    if (weekProgress >= 100) {
      return {
        type: "success" as const,
        icon: Trophy,
        message: "🏆 Weekly study goal achieved! You're crushing it!",
      };
    }

    // Good progress (on track or ahead)
    if (weekProgress >= expectedProgress) {
      return {
        type: "info" as const,
        icon: Sparkles,
        message: topTask 
          ? `You're on track! Next up: "${topTask.title}" (${topTask.priority} priority)`
          : `You're ahead of schedule — ${weeklyHoursCompleted.toFixed(1)}h done this week!`,
      };
    }

    // Slightly behind but not critical
    if (isBehind && hoursRemaining <= 5) {
      return {
        type: "warning" as const,
        icon: Clock,
        message: `Just ${hoursRemaining.toFixed(1)}h left to hit your weekly goal — you got this! 💪`,
      };
    }

    // Behind schedule
    if (isBehind) {
      return {
        type: "warning" as const,
        icon: AlertTriangle,
        message: `${hoursRemaining.toFixed(1)}h left this week — even 20 minutes counts! Jump in now.`,
      };
    }

    // Default: show next task
    if (topTask) {
      return {
        type: "info" as const,
        icon: Sparkles,
        message: `Today's focus: "${topTask.title}" (${topTask.priority} priority)`,
      };
    }

    // No tasks
    if (noTasks) {
      return {
        type: "info" as const,
        icon: Sparkles,
        message: "No tasks scheduled today. Add some or enjoy your break!",
      };
    }

    return null;
  };

  const contextMessage = getContextMessage();

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

      {contextMessage && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg w-fit ${
            contextMessage.type === "success"
              ? "text-success bg-success/10"
              : contextMessage.type === "warning"
              ? "text-warning bg-warning/10"
              : "text-primary bg-primary/10"
          }`}
        >
          <contextMessage.icon className="h-4 w-4" />
          <span className="text-sm">{contextMessage.message}</span>
        </motion.div>
      )}
    </div>
  );
}
