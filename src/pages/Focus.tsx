import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Play, Pause, RotateCcw, Coffee, Timer } from "lucide-react";

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const focusDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setMode(mode === "focus" ? "break" : "focus");
      setTimeLeft(mode === "focus" ? breakDuration : focusDuration);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = ((mode === "focus" ? focusDuration : breakDuration) - timeLeft) / (mode === "focus" ? focusDuration : breakDuration) * 100;

  return (
    <AppLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in">
        <h1 className="text-2xl font-display font-bold mb-8">
          <span className="gradient-text">{mode === "focus" ? "Focus" : "Break"}</span> Mode
        </h1>
        <GlassCard variant="neon" className="p-8 text-center">
          <ProgressRing value={progress} size={200} strokeWidth={12} showValue={false}>
            <span className="text-4xl font-display font-bold">{formatTime(timeLeft)}</span>
            <span className="text-sm text-muted-foreground">{mode === "focus" ? "Focus Time" : "Break Time"}</span>
          </ProgressRing>
          <div className="flex gap-4 mt-8 justify-center">
            <GradientButton size="lg" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </GradientButton>
            <GradientButton variant="outline" size="lg" onClick={() => { setTimeLeft(mode === "focus" ? focusDuration : breakDuration); setIsRunning(false); }}>
              <RotateCcw className="h-6 w-6" />
            </GradientButton>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
