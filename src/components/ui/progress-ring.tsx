import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  children?: React.ReactNode;
  variant?: "primary" | "accent" | "teal";
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({ value, max = 100, size = 120, strokeWidth = 8, className, showValue = true, children, variant = "primary" }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const offset = circumference - percentage * circumference;

    const gradientId = React.useId();

    const gradientColors = {
      primary: { start: "hsl(220, 100%, 60%)", mid: "hsl(250, 100%, 65%)", end: "hsl(280, 100%, 65%)" },
      accent: { start: "hsl(270, 100%, 65%)", mid: "hsl(295, 100%, 60%)", end: "hsl(320, 100%, 60%)" },
      teal: { start: "hsl(180, 100%, 50%)", mid: "hsl(210, 100%, 55%)", end: "hsl(240, 100%, 60%)" },
    };

    const colors = gradientColors[variant];
    const glowColor = variant === "primary" 
      ? "hsl(220, 100%, 60%)" 
      : variant === "accent" 
      ? "hsl(270, 100%, 65%)" 
      : "hsl(180, 100%, 50%)";

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg ref={ref} width={size} height={size} className="-rotate-90 transform">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="50%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
            <filter id={`glow-${gradientId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(230, 25%, 18%)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle with gradient and glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className="text-3xl font-display font-bold gradient-text">{Math.round(percentage * 100)}%</span>
          )}
          {children}
        </div>
      </div>
    );
  }
);
ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
