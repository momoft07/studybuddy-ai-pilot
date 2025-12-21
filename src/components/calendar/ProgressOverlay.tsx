import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";

interface ProgressOverlayProps {
  studiedMinutes: number;
  goalMinutes: number;
  date: Date;
}

export function ProgressOverlay({
  studiedMinutes,
  goalMinutes,
}: ProgressOverlayProps) {
  const percentage = useMemo(() => {
    if (goalMinutes === 0) return 0;
    return Math.min((studiedMinutes / goalMinutes) * 100, 100);
  }, [studiedMinutes, goalMinutes]);

  const isComplete = percentage >= 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (goalMinutes === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
      <div className={`p-2 rounded-lg ${isComplete ? "bg-green-500/20" : "bg-primary/20"}`}>
        {isComplete ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <Target className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            {isComplete ? "Goal reached!" : "Today's study progress"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(studiedMinutes)} / {formatTime(goalMinutes)}
          </span>
        </div>
        <Progress 
          value={percentage} 
          className={`h-2 ${isComplete ? "[&>div]:bg-green-500" : ""}`}
        />
      </div>
    </div>
  );
}
