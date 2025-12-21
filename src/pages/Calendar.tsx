import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  BookOpen,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isSameDay, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: "deadline" | "study" | "exam" | "reminder";
  course_id?: string;
}

// Using tasks as events for now
interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
}

const eventColors = {
  deadline: "bg-destructive/20 border-destructive text-destructive",
  study: "bg-primary/20 border-primary text-primary",
  exam: "bg-accent/20 border-accent text-accent-foreground",
  reminder: "bg-muted border-muted-foreground text-muted-foreground",
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "deadline" as const,
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, due_date, priority, status")
        .eq("user_id", user?.id)
        .not("due_date", "is", null)
        .order("due_date", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !selectedDate) {
      toast.error("Please enter a title and select a date");
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        user_id: user?.id,
        title: newEvent.title,
        description: newEvent.description || null,
        due_date: selectedDate.toISOString(),
        priority: newEvent.type as string === "exam" ? "high" : "medium",
        status: "pending",
      });

      if (error) throw error;

      toast.success("Event added to calendar!");
      setNewEvent({ title: "", description: "", type: "deadline" });
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleDeleteEvent = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

      toast.success("Event deleted");
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const getEventsForDate = (date: Date) => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Get dates that have events for calendar highlighting
  const eventDates = tasks
    .filter((t) => t.due_date)
    .map((t) => startOfDay(new Date(t.due_date!)));

  const hasEvent = (date: Date) => {
    return eventDates.some((d) => isSameDay(d, date));
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold md:text-3xl">
              <span className="gradient-text">Calendar</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              View all your deadlines and study sessions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <GradientButton>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Add Calendar Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected date:{" "}
                    <span className="text-foreground font-medium">
                      {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "None"}
                    </span>
                  </p>
                </div>
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={3}
                />
                <Select
                  value={newEvent.type}
                  onValueChange={(value: any) =>
                    setNewEvent({ ...newEvent, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">📅 Deadline</SelectItem>
                    <SelectItem value="study">📚 Study Session</SelectItem>
                    <SelectItem value="exam">📝 Exam</SelectItem>
                    <SelectItem value="reminder">🔔 Reminder</SelectItem>
                  </SelectContent>
                </Select>
                <GradientButton onClick={handleCreateEvent} className="w-full">
                  Add Event
                </GradientButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <GlassCard variant="neon" className="lg:col-span-2 p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full pointer-events-auto"
              modifiers={{
                hasEvent: (date) => hasEvent(date),
              }}
              modifiersClassNames={{
                hasEvent: "bg-primary/20 font-bold",
              }}
            />
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary" />
                <span className="text-muted-foreground">Has events</span>
              </div>
            </div>
          </GlassCard>

          {/* Selected Day Events */}
          <div className="space-y-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg gradient-primary p-2">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
                      : "Select a date"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedDateEvents.length} event
                    {selectedDateEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDate?.toISOString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    {selectedDateEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No events for this day
                      </p>
                    ) : (
                      selectedDateEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="rounded-full w-2 h-2 mt-2 bg-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {event.title}
                            </p>
                            {event.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {event.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.due_date &&
                                format(new Date(event.due_date), "h:mm a")}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </GlassCard>

            {/* Upcoming Events */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg gradient-accent p-2">
                  <BookOpen className="h-4 w-4 text-accent-foreground" />
                </div>
                <h3 className="font-semibold">Upcoming</h3>
              </div>
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                    onClick={() =>
                      task.due_date && setSelectedDate(new Date(task.due_date))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="truncate flex-1">{task.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {task.due_date &&
                        format(new Date(task.due_date), "MMM d")}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No upcoming events
                  </p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
