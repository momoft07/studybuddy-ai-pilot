import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Brain, Clock, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface WhatToDoNextProps {
  topTask?: { id: string; title: string; priority: string } | null;
  flashcardsToReview: number;
  hasStudyPlan: boolean;
}

export function WhatToDoNext({ topTask, flashcardsToReview, hasStudyPlan }: WhatToDoNextProps) {
  const suggestions = [
    ...(topTask
      ? [
          {
            icon: BookOpen,
            title: `Work on "${topTask.title}"`,
            subtitle: `${topTask.priority} priority task`,
            action: "/tasks",
            gradient: "gradient-primary",
          },
        ]
      : []),
    ...(flashcardsToReview > 0
      ? [
          {
            icon: Brain,
            title: `Review ${flashcardsToReview} flashcards`,
            subtitle: "Boost your retention",
            action: "/flashcards",
            gradient: "gradient-accent",
          },
        ]
      : []),
    {
      icon: Clock,
      title: "Start a focus session",
      subtitle: "25 min Pomodoro",
      action: "/focus",
      gradient: "bg-success",
    },
    ...(!hasStudyPlan
      ? [
          {
            icon: Sparkles,
            title: "Generate AI study plan",
            subtitle: "Get personalized schedule",
            action: "/study-plan",
            gradient: "gradient-teal",
          },
        ]
      : []),
  ].slice(0, 3);

  return (
    <GlassCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold">What to Do Next</h2>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={suggestion.action}>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all group cursor-pointer">
                <div className={`rounded-lg ${suggestion.gradient} p-2.5`}>
                  <suggestion.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.subtitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <p>You're all caught up! 🎉</p>
          <p className="mt-1">Enjoy your break or explore new features.</p>
        </div>
      )}
    </GlassCard>
  );
}
