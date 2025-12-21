import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Clock, Play, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SmartFocusButtonProps {
  topTask?: { title: string } | null;
}

export function SmartFocusButton({ topTask }: SmartFocusButtonProps) {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState({
    label: "25 min",
    value: 25,
    description: t("dashboard.classicPomodoro"),
  });

  const DURATIONS = [
    { label: "25 min", value: 25, description: t("dashboard.classicPomodoro") },
    { label: "50 min", value: 50, description: t("dashboard.deepWork") },
    { label: "90 min", value: 90, description: t("dashboard.extendedSession") },
  ];

  return (
    <Link to={`/focus?duration=${selectedDuration.value}`} className="block">
      <GlassCard hover className="flex items-center gap-4">
        <div className="rounded-lg bg-success p-3">
          <Clock className="h-6 w-6 text-success-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{t("dashboard.startFocusSession")}</h3>
          <p className="text-sm text-muted-foreground">
            {topTask
              ? `${t("dashboard.workOn")} "${topTask.title.slice(0, 20)}${topTask.title.length > 20 ? "..." : ""}"`
              : t("dashboard.startPomodoro")}
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
