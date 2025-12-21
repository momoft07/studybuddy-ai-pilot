import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, Flame } from "lucide-react";
import { format, isToday, isBefore, parseISO } from "date-fns";
import confetti from "canvas-confetti";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface TaskItemProps {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  streakDays?: number;
  onToggle: (id: string, status: string) => Promise<void>;
}

export function TaskItem({
  id,
  title,
  status,
  priority,
  dueDate,
  streakDays = 0,
  onToggle,
}: TaskItemProps) {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const isCompleted = status === "completed";

  const getDueLabel = () => {
    if (!dueDate) return null;
    const date = parseISO(dueDate);
    if (isToday(date)) {
      return `${t("common.dueToday")} ${format(date, "h:mm a")}`;
    }
    if (isBefore(date, new Date()) && !isCompleted) {
      return `${t("common.overdue")}: ${format(date, "MMM d")}`;
    }
    return `${t("common.due")} ${format(date, "MMM d")}`;
  };

  const handleToggle = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // If completing the task, fire confetti
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#3b82f6", "#8b5cf6", "#06b6d4"],
      });
      
      toast({
        title: `🎉 ${t("common.niceJob")}`,
        description: `"${title}" ${t("common.completed")}`,
      });
    }

    await onToggle(id, status);
    setIsAnimating(false);
  };

  const priorityStyles = {
    high: "bg-destructive/20 text-destructive border-destructive/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    low: "bg-muted text-muted-foreground border-border",
  };

  const priorityLabels = {
    high: t("common.high"),
    medium: t("common.medium"),
    low: t("common.low"),
  };

  const dueLabel = getDueLabel();
  const isOverdue = dueDate && isBefore(parseISO(dueDate), new Date()) && !isCompleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border border-transparent ${
        isOverdue ? "border-destructive/50" : ""
      }`}
    >
      <button
        onClick={handleToggle}
        disabled={isAnimating}
        className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <CheckCircle2 className="h-5 w-5 text-success" />
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={`block truncate ${
            isCompleted ? "line-through text-muted-foreground" : ""
          }`}
        >
          {title}
        </span>
        {dueLabel && (
          <span
            className={`text-xs flex items-center gap-1 mt-0.5 ${
              isOverdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            {dueLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {streakDays > 0 && (
          <div className="flex items-center gap-1 text-xs text-warning">
            <Flame className="h-3 w-3" />
            <span>{streakDays}d</span>
          </div>
        )}
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${
            priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles.low
          }`}
        >
          {priorityLabels[priority as keyof typeof priorityLabels] || priority}
        </span>
      </div>
    </motion.div>
  );
}
