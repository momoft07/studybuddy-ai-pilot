import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

interface FlashcardsErrorStateProps {
  error: string;
  onRetry: () => void;
  isOffline?: boolean;
}

export function FlashcardsErrorState({ error, onRetry, isOffline }: FlashcardsErrorStateProps) {
  return (
    <GlassCard className="py-12 text-center border-destructive/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          {isOffline ? (
            <WifiOff className="h-8 w-8 text-destructive" />
          ) : (
            <AlertCircle className="h-8 w-8 text-destructive" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isOffline ? "You're offline" : "Failed to load decks"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {isOffline 
            ? "Check your internet connection and try again."
            : error || "Something went wrong. Please try again."}
        </p>
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </motion.div>
    </GlassCard>
  );
}
