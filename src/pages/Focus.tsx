import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Coffee, Timer, Flame, Clock } from "lucide-react";

export default function FocusPage() {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessionsToday, setSessionsToday] = useState(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState(0);
  const sessionIdRef = useRef<string | null>(null);
  
  const focusDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    if (user) {
      fetchTodayStats();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const fetchTodayStats = async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("duration_minutes, completed")
      .eq("user_id", user?.id)
      .gte("started_at", startOfDay)
      .eq("completed", true);

    if (!error && data) {
      setSessionsToday(data.length);
      setTotalMinutesToday(data.reduce((acc, s) => acc + s.duration_minutes, 0));
    }
  };

  const startSession = async () => {
    if (mode === "focus" && !sessionIdRef.current) {
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .insert({
          user_id: user?.id,
          duration_minutes: 25,
          completed: false,
        })
        .select("id")
        .single();

      if (!error && data) {
        sessionIdRef.current = data.id;
      }
    }
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    
    if (mode === "focus" && sessionIdRef.current) {
      await supabase
        .from("pomodoro_sessions")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionIdRef.current);
      
      sessionIdRef.current = null;
      toast.success("Focus session completed! Time for a break 🎉");
      fetchTodayStats();
    } else {
      toast.success("Break over! Ready for another focus session? 💪");
    }
    
    setMode(mode === "focus" ? "break" : "focus");
    setTimeLeft(mode === "focus" ? breakDuration : focusDuration);
  };

  const resetTimer = () => {
    setTimeLeft(mode === "focus" ? focusDuration : breakDuration);
    setIsRunning(false);
    sessionIdRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress =
    ((mode === "focus" ? focusDuration : breakDuration) - timeLeft) /
    (mode === "focus" ? focusDuration : breakDuration) *
    100;

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
          <GlassCard className="flex items-center gap-3 p-4">
            <div className="rounded-lg gradient-primary p-2">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessionsToday}</p>
              <p className="text-xs text-muted-foreground">Sessions today</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-3 p-4">
            <div className="rounded-lg gradient-accent p-2">
              <Clock className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMinutesToday}</p>
              <p className="text-xs text-muted-foreground">Minutes focused</p>
            </div>
          </GlassCard>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-display font-bold mb-8">
            <span className="gradient-text">
              {mode === "focus" ? "Focus" : "Break"}
            </span>{" "}
            Mode
          </h1>
          <GlassCard variant="neon" className="p-8 text-center">
            <ProgressRing
              value={progress}
              size={200}
              strokeWidth={12}
              showValue={false}
            >
              <span className="text-4xl font-display font-bold">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                {mode === "focus" ? (
                  <>
                    <Timer className="h-4 w-4" /> Focus Time
                  </>
                ) : (
                  <>
                    <Coffee className="h-4 w-4" /> Break Time
                  </>
                )}
              </span>
            </ProgressRing>
            <div className="flex gap-4 mt-8 justify-center">
              <GradientButton
                size="lg"
                onClick={isRunning ? pauseSession : startSession}
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </GradientButton>
              <GradientButton variant="outline" size="lg" onClick={resetTimer}>
                <RotateCcw className="h-6 w-6" />
              </GradientButton>
            </div>
          </GlassCard>

          <p className="text-sm text-muted-foreground mt-6 text-center max-w-xs">
            {mode === "focus"
              ? "Stay focused! Minimize distractions and concentrate on your task."
              : "Take a short break. Stretch, hydrate, and rest your eyes."}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}