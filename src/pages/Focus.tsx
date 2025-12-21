import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Play, Pause, RotateCcw, Coffee, Timer, Flame, Clock, 
  Settings2, Shield, Volume2, SkipForward, Zap, Brain, GraduationCap,
  Link2, PartyPopper, BookOpen
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  const lastTickRef = useRef<number>(Date.now());
  const workerRef = useRef<Worker | null>(null);
  
  // Stats state
  const [sessionsToday, setSessionsToday] = useState(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState(0);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  
  // Settings state
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [chainSessions, setChainSessions] = useState(false);
  const [focusShieldEnabled, setFocusShieldEnabled] = useState(false);
  const [ambientSound, setAmbientSound] = useState("silence");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Session recap state
  const [showRecap, setShowRecap] = useState(false);
  const [completedSessionDuration, setCompletedSessionDuration] = useState(0);
  const [completedSessionMode, setCompletedSessionMode] = useState<"focus" | "break">("focus");
  
  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const PRESETS: TimerPreset[] = [
    { id: "classic", name: t("focus.presets.classic"), focusMinutes: 25, breakMinutes: 5, icon: <Timer className="h-4 w-4" /> },
    { id: "deepWork", name: t("focus.presets.deepWork"), focusMinutes: 50, breakMinutes: 10, icon: <Brain className="h-4 w-4" /> },
    { id: "quickReview", name: t("focus.presets.quickReview"), focusMinutes: 15, breakMinutes: 3, icon: <Zap className="h-4 w-4" /> },
    { id: "examMode", name: t("focus.presets.examMode"), focusMinutes: 90, breakMinutes: 15, icon: <GraduationCap className="h-4 w-4" /> },
  ];

  // Background timer using visibility API and time drift correction
  useEffect(() => {
    if (!isRunning) return;
    
    lastTickRef.current = Date.now();
    
    const tick = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTickRef.current) / 1000);
      
      if (elapsed >= 1) {
        lastTickRef.current = now;
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - elapsed);
          return newTime;
        });
      }
    };
    
    const interval = setInterval(tick, 1000);
    
    // Handle visibility change for background tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tick(); // Immediately sync time when tab becomes visible
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);

  // Check for session complete
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (user) {
      fetchTodayStats();
      fetchWeeklyStreak();
    }
  }, [user]);

  // Handle ambient sound
  useEffect(() => {
    if (ambientSound !== "silence" && isRunning) {
      // In a real app, you'd load actual audio files
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [ambientSound, isRunning]);

  // Update document title with timer
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(timeLeft)} - ${mode === "focus" ? t("nav.focus") : t("focus.breakTime")}`;
    } else {
      document.title = "StudyPilot";
    }
    return () => {
      document.title = "StudyPilot";
    };
  }, [timeLeft, isRunning, mode, t]);

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
    lastTickRef.current = Date.now();
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    
    // Store completed session info for recap
    setCompletedSessionDuration(mode === "focus" ? focusDuration : breakDuration);
    setCompletedSessionMode(mode);
    
    if (mode === "focus" && sessionIdRef.current) {
      await supabase
        .from("pomodoro_sessions")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionIdRef.current);
      
      sessionIdRef.current = null;
      fetchTodayStats();
      fetchWeeklyStreak();
    }
    
    // Show recap dialog
    setShowRecap(true);
    
    // Play notification sound
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Ignore errors if no audio file
    } catch {}
  };

  const handleRecapAction = (action: "break" | "focus" | "journal") => {
    setShowRecap(false);
    
    if (action === "journal") {
      toast.success(t("focus.loggedToJournal"));
      return;
    }
    
    const nextMode = action === "break" ? "break" : "focus";
    setMode(nextMode);
    setTimeLeft(nextMode === "focus" ? focusDuration * 60 : breakDuration * 60);
    
    if (chainSessions) {
      setTimeout(() => startSession(), 500);
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
  const isLowTime = timeLeft <= 5 && timeLeft > 0 && isRunning;

  // Progress ring component with pulse animation
  const circumference = 2 * Math.PI * 88; // radius = 88
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
            {/* Custom Progress Ring with Pulse Animation */}
            <div className="relative inline-flex items-center justify-center">
              <motion.svg
                width={200}
                height={200}
                className="transform -rotate-90"
                animate={isLowTime ? { scale: [1, 1.02, 1] } : {}}
                transition={isLowTime ? { duration: 0.5, repeat: Infinity } : {}}
              >
                {/* Background circle */}
                <circle
                  cx={100}
                  cy={100}
                  r={88}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={12}
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <motion.circle
                  cx={100}
                  cy={100}
                  r={88}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={isLowTime ? "drop-shadow-[0_0_10px_hsl(var(--primary))]" : ""}
                  animate={isLowTime ? { 
                    filter: ["drop-shadow(0 0 8px hsl(var(--primary)))", "drop-shadow(0 0 20px hsl(var(--primary)))", "drop-shadow(0 0 8px hsl(var(--primary)))"]
                  } : {}}
                  transition={isLowTime ? { duration: 0.5, repeat: Infinity } : {}}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </motion.svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className={`text-4xl font-display font-bold ${isLowTime ? "text-destructive" : ""}`}
                  animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
                  transition={isLowTime ? { duration: 0.5, repeat: Infinity } : {}}
                >
                  {formatTime(timeLeft)}
                </motion.span>
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
              </div>
            </div>
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
          {/* Chain Sessions */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/20 p-2">
                  <Link2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{t("focus.chainSessions")}</p>
                  <p className="text-xs text-muted-foreground">{t("focus.chainSessionsDesc")}</p>
                </div>
              </div>
              <Switch
                checked={chainSessions}
                onCheckedChange={setChainSessions}
              />
            </div>
          </GlassCard>

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

      {/* Session Recap Dialog */}
      <Dialog open={showRecap} onOpenChange={setShowRecap}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="rounded-full bg-green-500/20 p-4"
              >
                <PartyPopper className="h-10 w-10 text-green-500" />
              </motion.div>
            </div>
            <DialogTitle className="text-2xl">
              {completedSessionMode === "focus" 
                ? t("focus.recap.greatJob") 
                : t("focus.recap.breakComplete")}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {completedSessionMode === "focus"
                ? t("focus.recap.focusedFor", { minutes: completedSessionDuration })
                : t("focus.recap.restedFor", { minutes: completedSessionDuration })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            {completedSessionMode === "focus" ? (
              <>
                <Button
                  onClick={() => handleRecapAction("break")}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Coffee className="h-5 w-5" />
                  {t("focus.recap.startBreak")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRecapAction("journal")}
                  className="w-full gap-2"
                  size="lg"
                >
                  <BookOpen className="h-5 w-5" />
                  {t("focus.recap.logToJournal")}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleRecapAction("focus")}
                className="w-full gap-2"
                size="lg"
              >
                <Play className="h-5 w-5" />
                {t("focus.recap.startFocus")}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setShowRecap(false)}
              className="w-full"
            >
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
