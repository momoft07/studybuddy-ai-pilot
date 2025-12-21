import { motion } from "framer-motion";
import { Flame, AlertTriangle, Sparkles, PartyPopper, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    if (hour < 12) return t("dashboard.goodMorning");
    if (hour < 18) return t("dashboard.goodAfternoon");
    return t("dashboard.goodEvening");
  };

  const getStreakMessage = () => {
    if (streakCount === 0) return t("dashboard.startStreak");
    if (streakCount === 1) return t("dashboard.oneDayStreak");
    if (streakCount < 7) return `${streakCount} ${t("dashboard.daysStreak")}`;
    if (streakCount < 30) return `🔥 ${streakCount}${t("dashboard.onFire")}`;
    return `🏆 ${streakCount}${t("dashboard.legendary")}`;
  };

  const getContextMessage = () => {
    // All tasks completed today
    if (allTasksDone) {
      return {
        type: "success" as const,
        icon: PartyPopper,
        message: `${t("dashboard.allTasksCompleted", { count: totalTasksToday })} 🎉 ${weekProgress >= 100 ? t("dashboard.weeklyGoalCrushed") : ""}`,
      };
    }

    // Weekly goal achieved
    if (weekProgress >= 100) {
      return {
        type: "success" as const,
        icon: Trophy,
        message: `🏆 ${t("dashboard.weeklyGoalAchieved")}`,
      };
    }

    // Good progress (on track or ahead)
    if (weekProgress >= expectedProgress) {
      return {
        type: "info" as const,
        icon: Sparkles,
        message: topTask 
          ? `${t("dashboard.onTrack")} ${t("dashboard.nextUp")} "${topTask.title}" (${topTask.priority} ${t("dashboard.priority")})`
          : `${t("dashboard.aheadOfSchedule")} ${weeklyHoursCompleted.toFixed(1)}h ${t("dashboard.doneThisWeek")}`,
      };
    }

    // Slightly behind but not critical
    if (isBehind && hoursRemaining <= 5) {
      return {
        type: "warning" as const,
        icon: Clock,
        message: `${t("dashboard.hoursLeftGoal", { hours: hoursRemaining.toFixed(1) })} 💪`,
      };
    }

    // Behind schedule
    if (isBehind) {
      return {
        type: "warning" as const,
        icon: AlertTriangle,
        message: t("dashboard.hoursLeftWeek", { hours: hoursRemaining.toFixed(1) }),
      };
    }

    // Default: show next task
    if (topTask) {
      return {
        type: "info" as const,
        icon: Sparkles,
        message: `${t("dashboard.todaysFocusTask")} "${topTask.title}" (${topTask.priority} ${t("dashboard.priority")})`,
      };
    }

    // No tasks
    if (noTasks) {
      return {
        type: "info" as const,
        icon: Sparkles,
        message: t("dashboard.noTasksScheduled"),
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
