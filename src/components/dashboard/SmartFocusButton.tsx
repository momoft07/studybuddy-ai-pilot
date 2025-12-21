import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Clock, Play, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SmartFocusButtonProps {
  topTask?: { title: string } | null;
}

const DURATIONS = [
  { label: "25 min", value: 25, description: "Classic Pomodoro" },
  { label: "50 min", value: 50, description: "Deep work" },
  { label: "90 min", value: 90, description: "Extended session" },
];

export function SmartFocusButton({ topTask }: SmartFocusButtonProps) {
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);

  return (
    <Link to={`/focus?duration=${selectedDuration.value}`} className="block">
      <GlassCard hover className="flex items-center gap-4">
        <div className="rounded-lg bg-success p-3">
          <Clock className="h-6 w-6 text-success-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Start Focus Session</h3>
          <p className="text-sm text-muted-foreground">
            {topTask
              ? `Work on "${topTask.title.slice(0, 20)}${topTask.title.length > 20 ? "..." : ""}"`
              : "Start a Pomodoro session"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
            <GradientButton size="sm" className="gap-1">
              <Play className="h-4 w-4" />
              {selectedDuration.label}
              <ChevronDown className="h-3 w-3" />
            </GradientButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {DURATIONS.map((duration) => (
              <DropdownMenuItem
                key={duration.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedDuration(duration);
                }}
              >
                <div>
                  <p className="font-medium">{duration.label}</p>
                  <p className="text-xs text-muted-foreground">{duration.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </GlassCard>
    </Link>
  );
}
