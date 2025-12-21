import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  label?: string;
  showPercentage?: boolean;
}

export function TrendIndicator({
  value,
  previousValue,
  label = "from last week",
  showPercentage = true,
}: TrendIndicatorProps) {
  if (previousValue === 0 && value === 0) {
    return null;
  }

  const change = previousValue > 0
    ? ((value - previousValue) / previousValue) * 100
    : value > 0 ? 100 : 0;

  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-1 text-xs ${
        isNeutral
          ? "text-muted-foreground"
          : isPositive
          ? "text-success"
          : "text-destructive"
      }`}
    >
      {isNeutral ? (
        <Minus className="h-3 w-3" />
      ) : isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {showPercentage && (
        <span>
          {isPositive ? "+" : ""}
          {change.toFixed(0)}%
        </span>
      )}
      <span className="text-muted-foreground">{label}</span>
    </motion.div>
  );
}
