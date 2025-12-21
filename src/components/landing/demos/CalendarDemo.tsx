import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const events = [
  { day: 5, title: "Math Exam", type: "exam" },
  { day: 8, title: "Essay Due", type: "deadline" },
  { day: 12, title: "Study Group", type: "session" },
  { day: 15, title: "Physics Quiz", type: "exam" },
  { day: 20, title: "Lab Report", type: "deadline" },
];

export function CalendarDemo() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = 10; // Simulated "today"
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const getEventForDay = (day: number) => events.find(e => e.day === day);

  const eventColors = {
    exam: "bg-destructive",
    deadline: "bg-warning",
    session: "bg-primary",
  };

  const selectedEvent = selectedDay ? getEventForDay(selectedDay) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold">December 2024</span>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekDays.map(d => (
          <div key={d} className="p-2 text-muted-foreground font-medium">{d}</div>
        ))}
        
        {/* Empty cells for alignment */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {days.map(day => {
          const event = getEventForDay(day);
          const isToday = day === today;
          const isSelected = day === selectedDay;
          
          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(day)}
              className={`relative p-2 rounded-lg transition-all ${
                isToday ? "bg-primary text-white" : 
                isSelected ? "bg-muted ring-1 ring-primary" : 
                "hover:bg-muted/50"
              }`}
            >
              {day}
              {event && (
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${eventColors[event.type as keyof typeof eventColors]}`} />
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedEvent ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl glass border border-border/50"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${eventColors[selectedEvent.type as keyof typeof eventColors]}`} />
            <span className="font-medium text-sm">{selectedEvent.title}</span>
            <span className="text-xs text-muted-foreground ml-auto">Dec {selectedEvent.day}</span>
          </div>
        </motion.div>
      ) : (
        <div className="p-3 rounded-xl bg-muted/30 text-center text-xs text-muted-foreground">
          Tap a day to see events
        </div>
      )}

      <div className="flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Exam</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Deadline</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Session</span>
      </div>
    </div>
  );
}
