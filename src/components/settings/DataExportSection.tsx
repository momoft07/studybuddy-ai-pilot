import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DataExportSectionProps {
  userId: string;
}

export function DataExportSection({ userId }: DataExportSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | null>(null);
  const { toast } = useToast();

  const exportData = async (format: "json" | "csv") => {
    setIsExporting(true);
    setExportFormat(format);

    try {
      // Fetch all user data
      const [
        { data: profile },
        { data: notes },
        { data: flashcards },
        { data: decks },
        { data: tasks },
        { data: studyPlans },
        { data: courses },
        { data: pomodoroSessions },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("notes").select("*").eq("user_id", userId),
        supabase.from("flashcards").select("*").eq("user_id", userId),
        supabase.from("flashcard_decks").select("*").eq("user_id", userId),
        supabase.from("tasks").select("*").eq("user_id", userId),
        supabase.from("study_plans").select("*").eq("user_id", userId),
        supabase.from("courses").select("*").eq("user_id", userId),
        supabase.from("pomodoro_sessions").select("*").eq("user_id", userId),
      ]);

      const exportData = {
        exportedAt: new Date().toISOString(),
        profile,
        notes: notes || [],
        flashcardDecks: decks || [],
        flashcards: flashcards || [],
        tasks: tasks || [],
        studyPlans: studyPlans || [],
        courses: courses || [],
        pomodoroSessions: pomodoroSessions || [],
      };

      let blob: Blob;
      let filename: string;

      if (format === "json") {
        blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        filename = `studypilot-export-${new Date().toISOString().split("T")[0]}.json`;
      } else {
        // Convert to CSV (simplified - just main tables)
        const csvSections: string[] = [];

        // Notes CSV
        if (notes && notes.length > 0) {
          const headers = Object.keys(notes[0]).join(",");
          const rows = notes.map((n) =>
            Object.values(n)
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(",")
          );
          csvSections.push(`=== NOTES ===\n${headers}\n${rows.join("\n")}`);
        }

        // Tasks CSV
        if (tasks && tasks.length > 0) {
          const headers = Object.keys(tasks[0]).join(",");
          const rows = tasks.map((t) =>
            Object.values(t)
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(",")
          );
          csvSections.push(`\n\n=== TASKS ===\n${headers}\n${rows.join("\n")}`);
        }

        // Flashcards CSV
        if (flashcards && flashcards.length > 0) {
          const headers = Object.keys(flashcards[0]).join(",");
          const rows = flashcards.map((f) =>
            Object.values(f)
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(",")
          );
          csvSections.push(`\n\n=== FLASHCARDS ===\n${headers}\n${rows.join("\n")}`);
        }

        blob = new Blob([csvSections.join("")], { type: "text/csv" });
        filename = `studypilot-export-${new Date().toISOString().split("T")[0]}.csv`;
      }

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: `Your data has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-primary/20 p-2">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Data Export</h2>
          <p className="text-xs text-muted-foreground">
            Download all your data (GDPR compliant)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Export includes: notes, flashcards, tasks, study plans, courses, and session history.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => exportData("json")}
            disabled={isExporting}
            className="flex-1 min-w-[140px]"
          >
            {isExporting && exportFormat === "json" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileJson className="mr-2 h-4 w-4" />
            )}
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => exportData("csv")}
            disabled={isExporting}
            className="flex-1 min-w-[140px]"
          >
            {isExporting && exportFormat === "csv" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
