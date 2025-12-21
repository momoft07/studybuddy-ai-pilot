import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PremiumCard() {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem("premium-card-dismissed") === "true";
  });

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
    localStorage.setItem("premium-card-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/premium">
            <GlassCard variant="neon" hover className="p-6 relative group">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-background/50 transition-all"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg gradient-accent p-2 glow-accent pulse-glow">
                    <Sparkles className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Upgrade to Premium</h2>
                    <p className="text-sm text-muted-foreground">
                      Unlock all features & AI tools
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold gradient-text">€5/mo</span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
