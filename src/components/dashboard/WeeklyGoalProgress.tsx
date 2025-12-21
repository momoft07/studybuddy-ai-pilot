import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek } from "date-fns";

interface WeeklyGoalProgressProps {
  weeklyGoalHours?: number;
}

export function WeeklyGoalProgress({ weeklyGoalHours = 20 }: WeeklyGoalProgressProps) {
  const { user } = useAuth();
  const [hoursCompleted, setHoursCompleted] = useState(0);

  useEffect(() => {
    if (user) {
      fetchWeeklyHours();
    }
  }, [user]);

  const fetchWeeklyHours = async () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();

    const { data } = await supabase
      .from("pomodoro_sessions")
      .select("duration_minutes")
      .eq("user_id", user?.id)
      .eq("completed", true)
      .gte("started_at", weekStart)
      .lte("started_at", weekEnd);

    if (data) {
      const totalMinutes = data.reduce((acc, session) => acc + session.duration_minutes, 0);
      setHoursCompleted(Number((totalMinutes / 60).toFixed(1)));
    }
  };

  const progressPercentage = Math.min((hoursCompleted / weeklyGoalHours) * 100, 100);

  return (
    <GlassCard className="flex items-center gap-4">
      <ProgressRing 
        value={progressPercentage} 
        size={72} 
        strokeWidth={6}
        variant="teal"
      />
      <div>
        <h3 className="font-semibold">Weekly Goal Progress</h3>
        <p className="text-sm text-muted-foreground">
          {hoursCompleted} / {weeklyGoalHours} hours completed
        </p>
      </div>
    </GlassCard>
  );
}
