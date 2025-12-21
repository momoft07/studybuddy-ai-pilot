import * as React from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "teal";
  className?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, subtitle, icon: Icon, trend, variant = "default", className }, ref) => {
    const iconVariants = {
      default: "gradient-primary shadow-[0_0_15px_hsl(220_100%_60%/0.3)]",
      primary: "gradient-primary shadow-[0_0_20px_hsl(220_100%_60%/0.5)]",
      accent: "gradient-accent shadow-[0_0_20px_hsl(270_100%_65%/0.5)]",
      teal: "gradient-teal shadow-[0_0_20px_hsl(180_100%_50%/0.5)]",
    };

    return (
      <GlassCard ref={ref} hover className={cn("relative overflow-hidden group", className)}>
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-semibold",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                <span>{trend.isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "rounded-xl p-3 transition-all duration-300 group-hover:scale-110",
              iconVariants[variant]
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        {/* Enhanced decorative gradient blob */}
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />
      </GlassCard>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
