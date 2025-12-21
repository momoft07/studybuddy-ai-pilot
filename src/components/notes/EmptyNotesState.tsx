import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { FileText, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyNotesStateProps {
  isSearching: boolean;
  searchQuery: string;
  onCreateNote: () => void;
  onClearSearch: () => void;
}

export function EmptyNotesState({ 
  isSearching, 
  searchQuery, 
  onCreateNote,
  onClearSearch 
}: EmptyNotesStateProps) {
  if (isSearching) {
    return (
      <GlassCard className="py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            No notes matching "<span className="font-medium text-foreground">{searchQuery}</span>" were found.
            Try a different search term.
          </p>
          <button
            onClick={onClearSearch}
            className="text-primary hover:underline text-sm font-medium"
          >
            Clear search
          </button>
        </motion.div>
      </GlassCard>
    );
  }

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
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
          >
            <FileText className="h-12 w-12 text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -right-2 top-4 rounded-lg gradient-primary p-2 shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Start your first note!</h3>
        <p className="text-muted-foreground mb-6">
          Capture your study materials, lecture notes, or ideas. 
          Our AI can summarize them for quick review.
        </p>
        
        <GradientButton onClick={onCreateNote} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Note
        </GradientButton>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-primary">✍️</p>
            <p className="text-xs text-muted-foreground mt-1">Write or paste</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-primary">🎤</p>
            <p className="text-xs text-muted-foreground mt-1">Voice input</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold text-primary">📄</p>
            <p className="text-xs text-muted-foreground mt-1">Upload PDF</p>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
