import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface DayData {
  day: string;
  hours: number;
}

export function StudyHoursChart() {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [trend, setTrend] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchWeeklyData();
    }
  }, [user]);

  const fetchWeeklyData = async () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    
    // Fetch this week's sessions
    const { data: sessionsData } = await supabase
      .from("pomodoro_sessions")
      .select("duration_minutes, started_at")
      .eq("user_id", user?.id)
      .eq("completed", true)
      .gte("started_at", weekStart.toISOString());

    // Initialize days
    const days: DayData[] = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      days.push({
        day: format(date, "EEE").charAt(0),
        hours: 0,
      });
    }

    // Aggregate hours per day
    if (sessionsData) {
      sessionsData.forEach((session) => {
        const sessionDate = new Date(session.started_at);
        for (let i = 0; i < 7; i++) {
          const dayDate = addDays(weekStart, i);
          if (isSameDay(sessionDate, dayDate)) {
            days[i].hours += session.duration_minutes / 60;
          }
        }
      });
    }

    setWeekData(days);

    // Calculate trend (compare to last week - simulated for now)
    const thisWeekTotal = days.reduce((acc, d) => acc + d.hours, 0);
    const simulatedLastWeek = thisWeekTotal * 0.8; // Simulated last week data
    const trendValue = simulatedLastWeek > 0 
      ? Math.round(((thisWeekTotal - simulatedLastWeek) / simulatedLastWeek) * 100)
      : thisWeekTotal > 0 ? 100 : 0;
    setTrend(trendValue);
  };

  const maxHours = Math.max(...weekData.map((d) => d.hours), 4);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Study Hours This Week</h3>
        <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? "text-success" : "text-destructive"}`}>
          {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{trend >= 0 ? "+" : ""}{trend}%</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-24">
        {weekData.map((day, index) => (
          <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.hours / maxHours) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="w-full rounded-t-sm bg-gradient-to-t from-primary to-accent min-h-[4px]"
              style={{ minHeight: day.hours > 0 ? "8px" : "4px" }}
            />
            <span className="text-xs text-muted-foreground">{day.day}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
