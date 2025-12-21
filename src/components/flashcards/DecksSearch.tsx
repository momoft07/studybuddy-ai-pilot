import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Command, X, SortAsc, Calendar, Hash, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type SortOption = "name" | "created" | "cards" | "studied";

interface DecksSearchProps {
  value: string;
  onChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  totalCount: number;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "name", label: "Name", icon: <SortAsc className="h-4 w-4" /> },
  { value: "created", label: "Date Created", icon: <Calendar className="h-4 w-4" /> },
  { value: "cards", label: "Card Count", icon: <Hash className="h-4 w-4" /> },
  { value: "studied", label: "Last Studied", icon: <Clock className="h-4 w-4" /> },
];

export function DecksSearch({ 
  value, 
  onChange, 
  sortBy, 
  onSortChange,
  resultCount, 
  totalCount 
}: DecksSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onChange("");
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChange]);

  const isSearching = value.length > 0;
  const currentSort = sortOptions.find(s => s.value === sortBy);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          placeholder="Search decks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-24"
          aria-label="Search flashcard decks"
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

      {/* Sort dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[140px] justify-start">
            {currentSort?.icon}
            <span className="hidden sm:inline">{currentSort?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`gap-2 ${sortBy === option.value ? "bg-muted" : ""}`}
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
