import { useState } from "react";
import { Keyboard, ChevronDown, ChevronUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["G", "D"], description: "Go to Dashboard" },
      { keys: ["G", "N"], description: "Go to Notes" },
      { keys: ["G", "F"], description: "Go to Flashcards" },
      { keys: ["G", "T"], description: "Go to Tasks" },
      { keys: ["G", "C"], description: "Go to Calendar" },
      { keys: ["G", "S"], description: "Go to Settings" },
    ],
  },
  {
    category: "Actions",
    items: [
      { keys: ["⌘", "K"], description: "Quick search" },
      { keys: ["⌘", "N"], description: "Create new item" },
      { keys: ["⌘", "S"], description: "Save current item" },
      { keys: ["Esc"], description: "Close modal/dialog" },
    ],
  },
  {
    category: "Focus Mode",
    items: [
      { keys: ["Space"], description: "Start/Pause timer" },
      { keys: ["R"], description: "Reset timer" },
      { keys: ["S"], description: "Skip break" },
    ],
  },
  {
    category: "Flashcards",
    items: [
      { keys: ["Space"], description: "Flip card" },
      { keys: ["→"], description: "Next card (correct)" },
      { keys: ["←"], description: "Previous card (incorrect)" },
      { keys: ["1-5"], description: "Rate difficulty" },
    ],
  },
];

export function KeyboardShortcutsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <GlassCard className="p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Keyboard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            <p className="text-xs text-muted-foreground">
              Quick reference for power users
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[600px] mt-6" : "max-h-0"
        )}
      >
        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <span key={keyIdx}>
                          <kbd className="px-2 py-1 text-xs font-mono rounded bg-muted border border-border">
                            {key}
                          </kbd>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground mx-1">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
