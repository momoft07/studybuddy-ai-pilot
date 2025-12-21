import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  Loader2,
  GraduationCap,
  Coffee,
  Bell,
  AlertTriangle,
  Sparkles,
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { format, isSameDay, startOfDay, differenceInDays, differenceInHours, isPast, isToday, startOfToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DraggableEvent } from "@/components/calendar/DraggableEvent";
import { ExternalCalendarSync } from "@/components/calendar/ExternalCalendarSync";
import { ProgressOverlay } from "@/components/calendar/ProgressOverlay";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
}

interface FlashcardDeck {
  id: string;
  name: string;
  description: string | null;
}

interface Note {
  id: string;
  title: string;
}

interface PomodoroSession {
  id: string;
  duration_minutes: number;
  completed: boolean;
  started_at: string;
}

type EventType = "study" | "exam" | "break" | "deadline";

const eventTypeConfig: Record<EventType, { icon: React.ReactNode; color: string; dotColor: string }> = {
  study: { 
    icon: <BookOpen className="h-4 w-4" />, 
    color: "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400",
    dotColor: "bg-blue-500"
  },
  exam: { 
    icon: <GraduationCap className="h-4 w-4" />, 
    color: "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400",
    dotColor: "bg-red-500"
  },
  break: { 
    icon: <Coffee className="h-4 w-4" />, 
    color: "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400",
    dotColor: "bg-green-500"
  },
  deadline: { 
    icon: <Bell className="h-4 w-4" />, 
    color: "bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400",
    dotColor: "bg-orange-500"
  },
};

const durationOptions = [
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
];

export default function CalendarPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "study" as EventType,
    duration: "60",
  });

  // Daily study goal (in minutes) - could be fetched from user settings
  const dailyStudyGoal = 180; // 3 hours

  useEffect(() => {
    if (user) {
      fetchData();
      
      const channel = supabase
        .channel('calendar-tasks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchTasks()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchData = async () => {
    await Promise.all([fetchTasks(), fetchSuggestionSources(), fetchPomodoroSessions()]);
    setLoading(false);
  };

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
      toast.error(t("common.error"));
    }
  };

  const fetchSuggestionSources = async () => {
    try {
      const [decksRes, notesRes] = await Promise.all([
        supabase.from("flashcard_decks").select("id, name, description").eq("user_id", user?.id),
        supabase.from("notes").select("id, title").eq("user_id", user?.id),
      ]);
      
      if (decksRes.data) setFlashcardDecks(decksRes.data);
      if (notesRes.data) setNotes(notesRes.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchPomodoroSessions = async () => {
    try {
      const today = startOfToday();
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .select("id, duration_minutes, completed, started_at")
        .eq("user_id", user?.id)
        .gte("started_at", today.toISOString())
        .eq("completed", true);

      if (error) throw error;
      setPomodoroSessions(data || []);
    } catch (error) {
      console.error("Error fetching pomodoro sessions:", error);
    }
  };

  // Calculate today's studied minutes from pomodoro sessions
  const todayStudiedMinutes = useMemo(() => {
    return pomodoroSessions
      .filter(s => s.completed && isToday(new Date(s.started_at)))
      .reduce((acc, s) => acc + s.duration_minutes, 0);
  }, [pomodoroSessions]);

  const suggestions = useMemo(() => {
    const items: { title: string; type: EventType; source: string }[] = [];
    
    flashcardDecks.forEach(deck => {
      items.push({ 
        title: `${t("calendar.review")} ${deck.name}`, 
        type: "study", 
        source: "flashcards" 
      });
      items.push({ 
        title: `${deck.name} ${t("calendar.quiz")}`, 
        type: "exam", 
        source: "flashcards" 
      });
    });
    
    notes.forEach(note => {
      items.push({ 
        title: `${t("calendar.studyNote")}: ${note.title}`, 
        type: "study", 
        source: "notes" 
      });
    });
    
    return items;
  }, [flashcardDecks, notes, t]);

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !selectedDate) {
      toast.error(t("calendar.titleRequired"));
      return;
    }

    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const eventDate = new Date(selectedDate);
      eventDate.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.from("tasks").insert({
        user_id: user?.id,
        title: newEvent.title,
        description: `${newEvent.type.toUpperCase()} | ${newEvent.duration} min${newEvent.description ? ` | ${newEvent.description}` : ""}`,
        due_date: eventDate.toISOString(),
        priority: newEvent.type === "exam" ? "high" : newEvent.type === "deadline" ? "high" : "medium",
        status: "pending",
      });

      if (error) throw error;

      toast.success(t("calendar.eventAdded"));
      setNewEvent({ title: "", description: "", type: "study", duration: "60" });
      setSelectedTime("09:00");
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(t("common.error"));
    }
  };

  const handleDeleteEvent = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
      toast.success(t("calendar.eventDeleted"));
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(t("common.error"));
    }
  };

  const handleSelectSuggestion = (suggestion: { title: string; type: EventType }) => {
    setNewEvent(prev => ({ ...prev, title: suggestion.title, type: suggestion.type }));
    setSuggestionsOpen(false);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", eventId);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetDate(date);
  };

  const handleDragLeave = () => {
    setDropTargetDate(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDropTargetDate(null);
    
    if (!draggedEventId) return;

    const task = tasks.find(t => t.id === draggedEventId);
    if (!task || !task.due_date) return;

    // Keep the same time, just change the date
    const originalDate = new Date(task.due_date);
    const newDate = new Date(targetDate);
    newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ due_date: newDate.toISOString() })
        .eq("id", draggedEventId);

      if (error) throw error;

      toast.success(`Event moved to ${format(newDate, "MMM d")}`);
      fetchTasks();
    } catch (error) {
      console.error("Error moving event:", error);
      toast.error("Failed to move event");
    } finally {
      setDraggedEventId(null);
    }
  };

  const getEventType = (task: Task): EventType => {
    const desc = task.description?.toUpperCase() || "";
    if (desc.includes("EXAM")) return "exam";
    if (desc.includes("BREAK")) return "break";
    if (desc.includes("DEADLINE")) return "deadline";
    return "study";
  };

  const getDuration = (task: Task): string => {
    const match = task.description?.match(/(\d+)\s*min/);
    return match ? `${match[1]} min` : "";
  };

  const getEventsForDate = (date: Date) => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getEventTypesForDate = (date: Date): EventType[] => {
    const events = getEventsForDate(date);
    const types = new Set<EventType>();
    events.forEach(e => types.add(getEventType(e)));
    return Array.from(types);
  };

  // Upcoming deadlines sorted by urgency
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(t => t.due_date && (!isPast(new Date(t.due_date)) || isToday(new Date(t.due_date!))))
      .sort((a, b) => {
        const typeA = getEventType(a);
        const typeB = getEventType(b);
        const urgencyOrder: Record<EventType, number> = { exam: 0, deadline: 1, study: 2, break: 3 };
        
        if (urgencyOrder[typeA] !== urgencyOrder[typeB]) {
          return urgencyOrder[typeA] - urgencyOrder[typeB];
        }
        
        return new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime();
      })
      .slice(0, 5);
  }, [tasks]);

  const getTimeUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const days = differenceInDays(date, now);
    const hours = differenceInHours(date, now);
    
    if (days < 0) return t("calendar.overdue");
    if (days === 0) {
      if (hours <= 0) return t("calendar.now");
      if (hours === 1) return t("calendar.inOneHour");
      return t("calendar.inHours", { hours });
    }
    if (days === 1) return t("calendar.tomorrow");
    if (days === 2) return t("calendar.inTwoDays");
    return t("calendar.inDays", { days });
  };

  const getUrgencyColor = (dateStr: string, type: EventType) => {
    const date = new Date(dateStr);
    const days = differenceInDays(date, new Date());
    
    if (days < 0) return "text-destructive";
    if (days <= 1 && (type === "exam" || type === "deadline")) return "text-orange-500";
    if (days <= 2) return "text-yellow-500";
    return "text-muted-foreground";
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold md:text-3xl">
              <span className="gradient-text">{t("calendar.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("calendar.viewDeadlines")}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <GradientButton>
                <Plus className="mr-2 h-4 w-4" />
                {t("calendar.addEvent")}
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{t("calendar.addEvent")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("calendar.date")}</Label>
                    <div className="p-2 bg-muted/50 rounded-lg text-sm font-medium">
                      {selectedDate ? format(selectedDate, "MMM d, yyyy") : t("calendar.selectDate")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("calendar.time")}</Label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Title with suggestions */}
                <div className="space-y-2">
                  <Label>{t("calendar.eventTitle")}</Label>
                  <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Input
                          placeholder={t("calendar.eventTitlePlaceholder")}
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          onFocus={() => suggestions.length > 0 && setSuggestionsOpen(true)}
                        />
                        {suggestions.length > 0 && (
                          <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[400px]" align="start">
                      <Command>
                        <CommandInput placeholder={t("calendar.searchSuggestions")} />
                        <CommandList>
                          <CommandEmpty>{t("calendar.noSuggestions")}</CommandEmpty>
                          <CommandGroup heading={t("calendar.suggestions")}>
                            {suggestions.slice(0, 8).map((s, i) => (
                              <CommandItem
                                key={i}
                                onSelect={() => handleSelectSuggestion(s)}
                                className="flex items-center gap-2"
                              >
                                {eventTypeConfig[s.type].icon}
                                <span className="truncate">{s.title}</span>
                                <span className="ml-auto text-xs text-muted-foreground capitalize">
                                  {s.source}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("calendar.category")}</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            {t("calendar.categoryStudy")}
                          </span>
                        </SelectItem>
                        <SelectItem value="exam">
                          <span className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-red-500" />
                            {t("calendar.categoryExam")}
                          </span>
                        </SelectItem>
                        <SelectItem value="break">
                          <span className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-green-500" />
                            {t("calendar.categoryBreak")}
                          </span>
                        </SelectItem>
                        <SelectItem value="deadline">
                          <span className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-orange-500" />
                            {t("calendar.categoryDeadline")}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("calendar.duration")}</Label>
                    <Select
                      value={newEvent.duration}
                      onValueChange={(value) => setNewEvent({ ...newEvent, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>{t("calendar.description")}</Label>
                  <Textarea
                    placeholder={t("calendar.descriptionPlaceholder")}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <GradientButton onClick={handleCreateEvent} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("calendar.addEvent")}
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
              components={{
                DayContent: ({ date }) => {
                  const types = getEventTypesForDate(date);
                  const events = getEventsForDate(date);
                  const isDropTarget = dropTargetDate && isSameDay(date, dropTargetDate);
                  
                  return (
                    <HoverCard openDelay={200} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div 
                          className={`relative w-full h-full flex flex-col items-center justify-center transition-colors rounded-md ${
                            isDropTarget ? "bg-primary/20 ring-2 ring-primary" : ""
                          }`}
                          onDragOver={(e) => handleDragOver(e, date)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, date)}
                        >
                          <span>{date.getDate()}</span>
                          {types.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5">
                              {types.slice(0, 3).map((type, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${eventTypeConfig[type].dotColor}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </HoverCardTrigger>
                      {events.length > 0 && (
                        <HoverCardContent className="w-64 p-3" align="center">
                          <p className="font-medium text-sm mb-2">
                            {format(date, "MMMM d")} — {events.length} event{events.length > 1 ? "s" : ""}
                          </p>
                          <div className="space-y-1.5">
                            {events.slice(0, 3).map((event) => {
                              const type = getEventType(event);
                              const duration = getDuration(event);
                              return (
                                <div key={event.id} className={`flex items-center gap-2 p-1.5 rounded text-xs ${eventTypeConfig[type].color} border`}>
                                  {eventTypeConfig[type].icon}
                                  <span className="truncate flex-1">{event.title}</span>
                                  {duration && <span className="text-muted-foreground">{duration}</span>}
                                </div>
                              );
                            })}
                            {events.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{events.length - 3} {t("common.more")}
                              </p>
                            )}
                          </div>
                        </HoverCardContent>
                      )}
                    </HoverCard>
                  );
                }
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {(Object.entries(eventTypeConfig) as [EventType, typeof eventTypeConfig[EventType]][]).map(([type, config]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                  <span className="text-muted-foreground capitalize">{t(`calendar.category${type.charAt(0).toUpperCase() + type.slice(1)}`)}</span>
                </div>
              ))}
            </div>

            {/* Drag hint */}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Drag events between days to reschedule
            </p>
          </GlassCard>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Progress Overlay for Today */}
            {selectedDate && isToday(selectedDate) && (
              <ProgressOverlay
                studiedMinutes={todayStudiedMinutes}
                goalMinutes={dailyStudyGoal}
                date={selectedDate}
              />
            )}

            {/* Selected Day Events */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg gradient-primary p-2">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {selectedDate ? format(selectedDate, "MMMM d, yyyy") : t("calendar.selectDate")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedDateEvents.length} {t("calendar.events", { count: selectedDateEvents.length })}
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
                        {t("calendar.noEventsDay")}
                      </p>
                    ) : (
                      selectedDateEvents.map((event) => {
                        const type = getEventType(event);
                        return (
                          <DraggableEvent
                            key={event.id}
                            event={event}
                            type={type}
                            typeConfig={eventTypeConfig[type]}
                            onDelete={handleDeleteEvent}
                            onDragStart={handleDragStart}
                          />
                        );
                      })
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </GlassCard>

            {/* Upcoming Deadlines Widget */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-orange-500/20 p-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <h3 className="font-semibold">{t("calendar.upcomingDeadlines")}</h3>
              </div>
              <div className="space-y-2">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t("calendar.noUpcoming")}
                  </p>
                ) : (
                  upcomingDeadlines.map((task) => {
                    const type = getEventType(task);
                    const timeUntil = getTimeUntil(task.due_date!);
                    const urgencyColor = getUrgencyColor(task.due_date!, type);
                    
                    return (
                      <motion.div
                        key={task.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedDate(new Date(task.due_date!))}
                      >
                        <div className={`w-2 h-2 rounded-full ${eventTypeConfig[type].dotColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className={`text-xs ${urgencyColor}`}>{timeUntil}</p>
                        </div>
                        <div className="shrink-0">
                          {eventTypeConfig[type].icon}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </GlassCard>

            {/* External Calendar Sync */}
            <ExternalCalendarSync />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
