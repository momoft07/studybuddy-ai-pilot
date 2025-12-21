import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Play, Pause, RotateCcw, Coffee, Timer, Flame, Clock, 
  Settings2, Shield, Volume2, SkipForward, Zap, Brain, GraduationCap
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface TimerPreset {
  id: string;
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  icon: React.ReactNode;
}

const AMBIENT_SOUNDS = [
  { id: "silence", label: "Silence" },
  { id: "rain", label: "Rain" },
  { id: "cafe", label: "Café" },
  { id: "lofi", label: "Lo-fi" },
];

export default function FocusPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const sessionIdRef = useRef<string | null>(null);
  
  // Stats state
  const [sessionsToday, setSessionsToday] = useState(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState(0);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  
  // Settings state
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [autoStartNext, setAutoStartNext] = useState(false);
  const [focusShieldEnabled, setFocusShieldEnabled] = useState(false);
  const [ambientSound, setAmbientSound] = useState("silence");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const PRESETS: TimerPreset[] = [
    { id: "classic", name: t("focus.presets.classic"), focusMinutes: 25, breakMinutes: 5, icon: <Timer className="h-4 w-4" /> },
    { id: "deepWork", name: t("focus.presets.deepWork"), focusMinutes: 50, breakMinutes: 10, icon: <Brain className="h-4 w-4" /> },
    { id: "quickReview", name: t("focus.presets.quickReview"), focusMinutes: 15, breakMinutes: 3, icon: <Zap className="h-4 w-4" /> },
    { id: "examMode", name: t("focus.presets.examMode"), focusMinutes: 90, breakMinutes: 15, icon: <GraduationCap className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (user) {
      fetchTodayStats();
      fetchWeeklyStreak();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Handle ambient sound
  useEffect(() => {
    if (ambientSound !== "silence" && isRunning) {
      // In a real app, you'd load actual audio files
      // For now, we'll just show the UI
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [ambientSound, isRunning]);

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

  const fetchWeeklyStreak = async () => {
    // Calculate streak by checking consecutive days with completed sessions
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .select("id")
        .eq("user_id", user?.id)
        .gte("started_at", startOfDay)
        .lte("started_at", endOfDay)
        .eq("completed", true)
        .limit(1);
      
      if (!error && data && data.length > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    setWeeklyStreak(streak);
  };

  const startSession = async () => {
    if (mode === "focus" && !sessionIdRef.current) {
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .insert({
          user_id: user?.id,
          duration_minutes: focusDuration,
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
      toast.success(t("focus.focusSessionComplete"));
      fetchTodayStats();
      fetchWeeklyStreak();
    } else {
      toast.success(t("focus.breakOver"));
    }
    
    const nextMode = mode === "focus" ? "break" : "focus";
    setMode(nextMode);
    setTimeLeft(nextMode === "focus" ? focusDuration * 60 : breakDuration * 60);
    
    if (autoStartNext) {
      setTimeout(() => startSession(), 1000);
    }
  };

  const resetTimer = () => {
    setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
    setIsRunning(false);
    sessionIdRef.current = null;
  };

  const applyPreset = (preset: TimerPreset) => {
    setFocusDuration(preset.focusMinutes);
    setBreakDuration(preset.breakMinutes);
    setTimeLeft(mode === "focus" ? preset.focusMinutes * 60 : preset.breakMinutes * 60);
    setIsRunning(false);
    sessionIdRef.current = null;
    toast.success(t("focus.presetApplied", { preset: preset.name }));
    setSettingsOpen(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentDuration = mode === "focus" ? focusDuration * 60 : breakDuration * 60;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        {/* Stats Row */}
        <div className="grid gap-3 grid-cols-3">
          <GlassCard className="flex items-center gap-3 p-4">
            <div className="rounded-lg gradient-primary p-2">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessionsToday}</p>
              <p className="text-xs text-muted-foreground">{t("focus.sessionsToday")}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-3 p-4">
            <div className="rounded-lg gradient-accent p-2">
              <Clock className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMinutesToday}</p>
              <p className="text-xs text-muted-foreground">{t("focus.minutesFocused")}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-orange-500/20 p-2">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold flex items-center gap-1">
                {weeklyStreak}
                {weeklyStreak >= 3 && <span className="text-sm">🔥</span>}
              </p>
              <p className="text-xs text-muted-foreground">{t("focus.dayStreak")}</p>
            </div>
          </GlassCard>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-display font-bold">
              <span className="gradient-text">
                {mode === "focus" ? t("nav.focus") : t("focus.breakTime")}
              </span>{" "}
              {t("focus.mode")}
            </h1>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("focus.timerSettings")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Presets */}
                  <div className="space-y-3">
                    <Label>{t("focus.presets.title")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((preset) => (
                        <Button
                          key={preset.id}
                          variant="outline"
                          className="justify-start gap-2 h-auto py-3"
                          onClick={() => applyPreset(preset)}
                        >
                          {preset.icon}
                          <div className="text-left">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {preset.focusMinutes}/{preset.breakMinutes} min
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Duration */}
                  <div className="space-y-4">
                    <Label>{t("focus.customDuration")}</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t("focus.focusDuration")}</span>
                          <span className="text-muted-foreground">{focusDuration} min</span>
                        </div>
                        <Slider
                          value={[focusDuration]}
                          onValueChange={([val]) => {
                            setFocusDuration(val);
                            if (mode === "focus" && !isRunning) {
                              setTimeLeft(val * 60);
                            }
                          }}
                          min={5}
                          max={120}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t("focus.breakDurationLabel")}</span>
                          <span className="text-muted-foreground">{breakDuration} min</span>
                        </div>
                        <Slider
                          value={[breakDuration]}
                          onValueChange={([val]) => {
                            setBreakDuration(val);
                            if (mode === "break" && !isRunning) {
                              setTimeLeft(val * 60);
                            }
                          }}
                          min={1}
                          max={30}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <GlassCard variant="neon" className="p-8 text-center w-full max-w-sm">
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
                    <Timer className="h-4 w-4" /> {t("focus.focusTime")}
                  </>
                ) : (
                  <>
                    <Coffee className="h-4 w-4" /> {t("focus.breakTime")}
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
              ? t("focus.focusTip")
              : t("focus.breakTip")}
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Focus Shield */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{t("focus.focusShield")}</p>
                  <p className="text-xs text-muted-foreground">{t("focus.focusShieldDesc")}</p>
                </div>
              </div>
              <Switch
                checked={focusShieldEnabled}
                onCheckedChange={(checked) => {
                  setFocusShieldEnabled(checked);
                  toast.success(checked ? t("focus.shieldEnabled") : t("focus.shieldDisabled"));
                }}
              />
            </div>
          </GlassCard>

          {/* Auto-Start Next */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/20 p-2">
                  <SkipForward className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{t("focus.autoStartNext")}</p>
                  <p className="text-xs text-muted-foreground">{t("focus.autoStartNextDesc")}</p>
                </div>
              </div>
              <Switch
                checked={autoStartNext}
                onCheckedChange={setAutoStartNext}
              />
            </div>
          </GlassCard>
        </div>

        {/* Ambient Sounds */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <Volume2 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">{t("focus.ambientSounds")}</p>
                <p className="text-xs text-muted-foreground">{t("focus.ambientSoundsDesc")}</p>
              </div>
            </div>
            <Select value={ambientSound} onValueChange={setAmbientSound}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AMBIENT_SOUNDS.map((sound) => (
                  <SelectItem key={sound.id} value={sound.id}>
                    {t(`focus.sounds.${sound.id}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
