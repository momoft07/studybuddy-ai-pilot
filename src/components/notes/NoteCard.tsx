import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  MoreVertical,
  Sparkles,
  Trash2,
  Loader2,
  Copy,
  FileDown,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  created_at: string;
  updated_at?: string;
}

interface NoteCardProps {
  note: Note;
  isSummarizing: boolean;
  onSummarize: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

function getWordCount(text: string | null): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    if (diffInHours < 1) return "Just now";
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  if (diffInHours < 48) return "Yesterday";
  
  if (diffInHours < 168) { // 7 days
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  return format(date, "MMM d, yyyy");
}

export function NoteCard({ 
  note, 
  isSummarizing, 
  onSummarize, 
  onDelete,
  onCopy 
}: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordCount = getWordCount(note.content);
  const relativeTime = getRelativeTime(note.created_at);
  const hasSummary = !!note.summary;
  
  const contentPreview = note.content?.slice(0, 150) || "No content";
  const hasMoreContent = (note.content?.length || 0) > 150;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard 
        hover 
        className="relative group focus-within:ring-2 focus-within:ring-primary/50 transition-all"
        tabIndex={0}
        role="article"
        aria-label={`Note: ${note.title}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="rounded-lg gradient-primary p-1.5 shrink-0">
              <BookOpen className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </div>
            <h3 className="font-semibold line-clamp-1 text-sm md:text-base">{note.title}</h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                aria-label="Note actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={onSummarize}
                disabled={isSummarizing || !note.content}
                className="gap-2"
              >
                {isSummarizing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : hasSummary ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {hasSummary ? "Regenerate Summary" : "AI Summarize"}
                <Crown className="h-3 w-3 ml-auto text-amber-500" aria-label="Pro feature" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopy} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" disabled>
                <FileDown className="h-4 w-4" />
                Export as PDF
                <Badge variant="outline" className="ml-auto text-[10px] px-1">Soon</Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Preview */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            {isExpanded ? note.content : contentPreview}
            {!isExpanded && hasMoreContent && "..."}
          </p>
          {hasMoreContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>

        {/* AI Summary */}
        <AnimatePresence>
          {isSummarizing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/10 rounded-lg p-3 mb-3 border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-xs font-medium text-primary">Generating AI summary...</p>
              </div>
              <div className="mt-2 space-y-1">
                <div className="h-2 bg-primary/20 rounded animate-pulse w-full" />
                <div className="h-2 bg-primary/20 rounded animate-pulse w-3/4" />
              </div>
            </motion.div>
          )}
          
          {note.summary && !isSummarizing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 rounded-lg p-3 mb-3 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                <p className="text-xs font-medium text-primary">AI Summary</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {note.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{relativeTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{wordCount} words</span>
            {hasSummary && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Summarized
              </Badge>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
