import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Crown, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { VoiceInput } from "@/components/notes/VoiceInput";
import { PdfUpload } from "@/components/notes/PdfUpload";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteSkeletonGrid } from "@/components/notes/NoteSkeleton";
import { EmptyNotesState } from "@/components/notes/EmptyNotesState";
import { ErrorState } from "@/components/notes/ErrorState";
import { NotesSearch } from "@/components/notes/NotesSearch";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  created_at: string;
}

export default function NotesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const [createTab, setCreateTab] = useState<"write" | "upload">("write");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; note: Note | null }>({
    isOpen: false,
    note: null,
  });

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, summary, created_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const { error } = await supabase.from("notes").insert({
        user_id: user?.id,
        title: newNote.title,
        content: newNote.content,
      });

      if (error) throw error;

      toast.success("Note created successfully!");
      setNewNote({ title: "", content: "" });
      setIsDialogOpen(false);
      fetchNotes();
    } catch (err) {
      console.error("Error creating note:", err);
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteDialog.note) return;
    
    const noteId = deleteDialog.note.id;
    setDeleteDialog({ isOpen: false, note: null });

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      toast.success("Note deleted", {
        description: "The note has been permanently removed.",
      });
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Failed to delete note");
    }
  };

  const handleSummarize = async (noteId: string, content: string | null) => {
    if (!content) {
      toast.error("No content to summarize");
      return;
    }

    setSummarizing(noteId);
    
    try {
      const response = await supabase.functions.invoke("ai-tutor", {
        body: {
          message: `Please summarize the following text concisely, highlighting the key points:\n\n${content.substring(0, 3000)}`,
        },
      });

      if (response.error) throw response.error;

      const summary = response.data?.response || "Summary generated successfully.";
      
      const { error } = await supabase
        .from("notes")
        .update({ summary })
        .eq("id", noteId);

      if (error) throw error;

      setNotes(notes.map(n => 
        n.id === noteId ? { ...n, summary } : n
      ));
      
      toast.success("Summary generated!", {
        description: "AI has analyzed and summarized your note.",
      });
    } catch (err) {
      console.error("Error summarizing:", err);
      toast.error("Failed to generate summary", {
        description: "Please try again later.",
      });
    } finally {
      setSummarizing(null);
    }
  };

  const handleCopyNote = (note: Note) => {
    const textToCopy = note.summary 
      ? `${note.title}\n\n${note.content}\n\n--- AI Summary ---\n${note.summary}`
      : `${note.title}\n\n${note.content}`;
    
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard!");
  };

  const handleVoiceTranscript = (text: string) => {
    setNewNote(prev => ({
      ...prev,
      content: prev.content ? `${prev.content} ${text}` : text
    }));
  };

  const handlePdfExtracted = (text: string, fileName: string) => {
    setNewNote({
      title: fileName.replace(".pdf", ""),
      content: text
    });
    setCreateTab("write");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-display font-bold md:text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="gradient-text">{t("notes.title")}</span> {t("notes.summaries")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t("notes.subtitle")}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <GradientButton className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {t("notes.newNote")}
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="glass-strong max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {t("notes.createNote")}
                  <Badge variant="outline" className="ml-2 text-xs">
                    <Crown className="h-3 w-3 mr-1" /> {t("notes.premium")}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <Tabs value={createTab} onValueChange={(v) => setCreateTab(v as "write" | "upload")} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">{t("notes.write")}</TabsTrigger>
                  <TabsTrigger value="upload">{t("notes.uploadPdf")}</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="space-y-4 mt-4">
                  <Input
                    placeholder={t("notes.noteTitle")}
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    aria-label={t("notes.noteTitle")}
                  />
                  <div className="relative">
                    <Textarea
                      placeholder={t("notes.writeNotes")}
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      rows={8}
                      aria-label={t("notes.writeNotes")}
                    />
                    <div className="absolute bottom-2 right-2">
                      <VoiceInput onTranscript={handleVoiceTranscript} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t("notes.autoSaved")}</span>
                    <span>{newNote.content.split(/\s+/).filter(Boolean).length} {t("notes.words")}</span>
                  </div>
                  <GradientButton onClick={handleCreateNote} className="w-full">
                    {t("notes.createNote")}
                  </GradientButton>
                </TabsContent>
                <TabsContent value="upload" className="space-y-4 mt-4">
                  <PdfUpload onExtractedText={handlePdfExtracted} />
                  {newNote.content && (
                    <div className="space-y-2">
                      <Input
                        placeholder={t("notes.noteTitle")}
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("notes.contentExtracted")}
                      </p>
                      <GradientButton onClick={handleCreateNote} className="w-full">
                        {t("notes.createNote")}
                      </GradientButton>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <NotesSearch
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredNotes.length}
          totalCount={notes.length}
        />

        {/* Content */}
        {loading ? (
          <NoteSkeletonGrid />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchNotes} />
        ) : notes.length === 0 || (isSearching && filteredNotes.length === 0) ? (
          <EmptyNotesState
            isSearching={isSearching}
            searchQuery={searchQuery}
            onCreateNote={() => setIsDialogOpen(true)}
            onClearSearch={() => setSearchQuery("")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSummarizing={summarizing === note.id}
                  onSummarize={() => handleSummarize(note.id, note.content)}
                  onDelete={() => setDeleteDialog({ isOpen: true, note })}
                  onCopy={() => handleCopyNote(note)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteNoteDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, note: null })}
          onConfirm={handleDeleteNote}
          noteTitle={deleteDialog.note?.title || ""}
        />
      </div>
    </AppLayout>
  );
}
