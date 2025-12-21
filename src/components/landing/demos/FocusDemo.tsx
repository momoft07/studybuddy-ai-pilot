import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion } from "framer-motion";

export function FocusDemo() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    setIsRunning(false);
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/30"
            />
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(220, 100%, 60%)" />
                <stop offset="100%" stopColor="hsl(270, 100%, 65%)" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold">{formatTime(timeLeft)}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {isBreak ? (
                <>
                  <Coffee className="h-3 w-3" /> Break time
                </>
              ) : (
                "Focus session"
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className={!isBreak ? "text-primary" : ""}>🍅 25 min focus</span>
        <span className={isBreak ? "text-success" : ""}>☕ 5 min break</span>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        🎯 The Pomodoro technique boosts concentration & retention
      </p>
    </div>
  );
}
