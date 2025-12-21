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
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({ value, max = 100, size = 120, strokeWidth = 8, className, showValue = true, children }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const offset = circumference - percentage * circumference;

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg ref={ref} width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
              <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className="text-2xl font-bold gradient-text">{Math.round(percentage * 100)}%</span>
          )}
          {children}
        </div>
      </div>
    );
  }
);
ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
