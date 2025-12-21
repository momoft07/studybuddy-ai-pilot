import { forwardRef } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Sparkles, Rocket, BookOpen, Target } from "lucide-react";

interface EmptyPlanStateProps {
  onScrollToForm: () => void;
}

export const EmptyPlanState = forwardRef<HTMLDivElement, EmptyPlanStateProps>(
  ({ onScrollToForm }, ref) => {
    return (
      <div ref={ref}>
    <GlassCard className="p-6">
      <h3 className="font-semibold mb-3">Your Study Plans</h3>
      <div className="py-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary/20 mb-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket className="h-10 w-10 text-primary" />
            </motion.div>
          </div>
        </motion.div>
        
        <p className="text-muted-foreground mb-2">No study plans yet</p>
        <button
          onClick={onScrollToForm}
          className="text-sm text-primary hover:underline cursor-pointer mb-4 inline-flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3" />
          Generate your first AI-powered study plan above!
        </button>
        
        <div className="mt-4">
          <GradientButton size="sm" onClick={onScrollToForm}>
            <Sparkles className="mr-2 h-4 w-4" />
            Create New Plan
          </GradientButton>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/30">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">AI-Powered</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Track Progress</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <Sparkles className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Personalized</p>
          </div>
        </div>
      </div>
      </GlassCard>
    </div>
  );
});

EmptyPlanState.displayName = "EmptyPlanState";
