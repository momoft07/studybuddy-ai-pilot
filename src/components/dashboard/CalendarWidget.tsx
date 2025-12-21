import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format, isSameDay, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  title: string;
  due_date: string;
}

export function CalendarWidget() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      
      // Subscribe to realtime changes
      const channel = supabase
        .channel('calendar-widget-tasks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("id, title, due_date")
      .eq("user_id", user?.id)
      .not("due_date", "is", null)
      .order("due_date", { ascending: true });

    if (data) {
      setTasks(data as Task[]);
    }
  };

  const getEventsForDate = (date: Date) => {
    return tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const eventDates = tasks
    .filter((t) => t.due_date)
    .map((t) => startOfDay(new Date(t.due_date)));

  const hasEvent = (date: Date) => {
    return eventDates.some((d) => isSameDay(d, date));
  };

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t("nav.calendar")}</h2>
        </div>
        <Link to="/calendar">
          <GradientButton variant="ghost" size="sm">
            {t("common.viewFull")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </GradientButton>
        </Link>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="w-full pointer-events-auto"
        modifiers={{
          hasEvent: (date) => hasEvent(date),
        }}
        modifiersClassNames={{
          hasEvent: "bg-primary/20 font-bold",
        }}
      />

      <div className="mt-4 border-t border-border/50 pt-4">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {format(selectedDate, "MMMM d")}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-1.5 max-h-24 overflow-y-auto"
          >
            {selectedDateEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("common.noEvents")}</p>
            ) : (
              selectedDateEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="truncate">{event.title}</span>
                </div>
              ))
            )}
            {selectedDateEvents.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{selectedDateEvents.length - 3} {t("common.more")}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
