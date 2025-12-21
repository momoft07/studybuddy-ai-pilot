import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Brain, Plus, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyDecksStateProps {
  onCreateDeck: () => void;
}

export function EmptyDecksState({ onCreateDeck }: EmptyDecksStateProps) {
  return (
    <GlassCard className="py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto"
      >
        {/* Illustration */}
        <div className="relative mx-auto h-32 w-32 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-primary/20"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute inset-4 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center"
          >
            <Brain className="h-12 w-12 text-accent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -right-2 top-4 rounded-lg gradient-primary p-2 shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-2 bottom-4 rounded-lg bg-accent p-2 shadow-lg"
          >
            <Zap className="h-4 w-4 text-accent-foreground" />
          </motion.div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Create your first deck!</h3>
        <p className="text-muted-foreground mb-6">
          Build flashcard decks to master any subject. 
          Our spaced repetition system helps you remember more, faster.
        </p>
        
        <GradientButton onClick={onCreateDeck} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Deck
        </GradientButton>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-primary">🧠</p>
            <p className="text-xs text-muted-foreground mt-1">Spaced repetition</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-primary">✨</p>
            <p className="text-xs text-muted-foreground mt-1">AI-powered</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-primary">📈</p>
            <p className="text-xs text-muted-foreground mt-1">Track progress</p>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
