import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  Timer, 
  Target, 
  PenLine,
  Sparkles,
  Play,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";

export type StudyMode = "spaced" | "timed" | "focus" | "test";

interface StudyModeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: StudyMode) => void;
  deckName: string;
  dueCards: number;
  totalCards: number;
}

const studyModes: { 
  id: StudyMode; 
  name: string; 
  description: string; 
  icon: React.ReactNode;
  isPro?: boolean;
}[] = [
  {
    id: "spaced",
    name: "Spaced Repetition",
    description: "Study cards based on memory strength. Most effective for long-term retention.",
    icon: <RotateCcw className="h-5 w-5" />,
  },
  {
    id: "timed",
    name: "Timed Quiz",
    description: "Race against the clock! Perfect for exam prep and quick reviews.",
    icon: <Timer className="h-5 w-5" />,
  },
  {
    id: "focus",
    name: "Focus Mode",
    description: "Only review cards you've gotten wrong. Targeted practice.",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: "test",
    name: "Test Yourself",
    description: "Type your answer before revealing. Best for active recall.",
    icon: <PenLine className="h-5 w-5" />,
    isPro: true,
  },
];

export function StudyModeDialog({
  isOpen,
  onClose,
  onSelectMode,
  deckName,
  dueCards,
  totalCards,
}: StudyModeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choose Study Mode
          </DialogTitle>
          <DialogDescription>
            Studying "{deckName}" • {dueCards > 0 ? `${dueCards} cards due` : `${totalCards} cards`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {studyModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => !mode.isPro && onSelectMode(mode.id)}
                disabled={mode.isPro}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  mode.isPro
                    ? "border-border/50 opacity-60 cursor-not-allowed"
                    : "border-border hover:border-primary/50 hover:bg-muted/50 focus:ring-2 focus:ring-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${mode.isPro ? "bg-muted" : "gradient-primary"}`}>
                    <span className={mode.isPro ? "text-muted-foreground" : "text-primary-foreground"}>
                      {mode.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{mode.name}</h4>
                      {mode.id === "spaced" && dueCards > 0 && (
                        <Badge className="bg-amber-500 text-amber-950 text-[10px]">
                          Recommended
                        </Badge>
                      )}
                      {mode.isPro && (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Crown className="h-3 w-3" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mode.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <GradientButton variant="ghost" onClick={onClose}>
            Cancel
          </GradientButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
