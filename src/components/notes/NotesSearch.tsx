import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Command, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotesSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export function NotesSearch({ value, onChange, resultCount, totalCount }: NotesSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onChange("");
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChange]);

  const isSearching = value.length > 0;

  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-10 pr-24"
        aria-label="Search notes"
      />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <Badge variant="secondary" className="text-xs">
                {resultCount} of {totalCount}
              </Badge>
              <button
                onClick={() => onChange("")}
                className="p-1 hover:bg-muted rounded-md transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="shortcut"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Badge 
                variant="outline" 
                className="text-[10px] gap-1 text-muted-foreground hidden md:flex"
              >
                <Command className="h-2.5 w-2.5" />
                K
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Focus ring indicator */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-md ring-2 ring-primary/50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
