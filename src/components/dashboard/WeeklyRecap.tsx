import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ChevronDown, ChevronUp, Clock, Target, Brain, Flame, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface WeeklyRecapProps {
  hoursStudied: number;
  targetHours: number;
  tasksCompleted: number;
  flashcardsReviewed: number;
  streakDays: number;
  previousWeekHours: number;
}

export function WeeklyRecap({
  hoursStudied,
  targetHours,
  tasksCompleted,
  flashcardsReviewed,
  streakDays,
  previousWeekHours,
}: WeeklyRecapProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const weeklyChange = previousWeekHours > 0
    ? ((hoursStudied - previousWeekHours) / previousWeekHours) * 100
    : 0;

  const handleShare = () => {
    const text = `📚 My StudyPilot ${t("dashboard.weeklyRecap")}:\n⏱️ ${hoursStudied} ${t("dashboard.hoursStudied").toLowerCase()}\n✅ ${tasksCompleted} ${t("dashboard.tasksDone").toLowerCase()}\n🔥 ${streakDays} ${t("dashboard.streak").toLowerCase()}\n\nStudy smarter with StudyPilot!`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: t("common.copiedToClipboard"),
        description: t("common.shareProgress"),
      });
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t("dashboard.weeklyRecap")}</h2>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">{hoursStudied}h</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.hoursStudied")}</p>
                  {weeklyChange !== 0 && (
                    <p className={`text-xs mt-1 ${weeklyChange > 0 ? "text-success" : "text-destructive"}`}>
                      {weeklyChange > 0 ? "↑" : "↓"} {Math.abs(weeklyChange).toFixed(0)}% {t("dashboard.vsLastWeek")}
                    </p>
                  )}
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <Target className="h-5 w-5 mx-auto mb-1 text-success" />
                  <p className="text-2xl font-bold">{tasksCompleted}</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.tasksDone")}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <Brain className="h-5 w-5 mx-auto mb-1 text-accent" />
                  <p className="text-2xl font-bold">{flashcardsReviewed}</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.cardsReviewed")}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-warning" />
                  <p className="text-2xl font-bold">{streakDays}</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.streak")}</p>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>{t("dashboard.weeklyGoalProgress")}</span>
                  <span className="font-semibold">{hoursStudied}/{targetHours}h</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((hoursStudied / targetHours) * 100, 100)}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full gradient-primary rounded-full"
                  />
                </div>
              </div>

              {/* Share Button */}
              <GradientButton
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {t("dashboard.shareMyProgress")}
              </GradientButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
