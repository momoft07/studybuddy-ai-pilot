import { motion } from "framer-motion";
import { Flame, TrendingUp, Clock, Target } from "lucide-react";

const weekData = [
  { day: "M", hours: 2.5 },
  { day: "T", hours: 3.2 },
  { day: "W", hours: 1.8 },
  { day: "T", hours: 4.1 },
  { day: "F", hours: 2.9 },
  { day: "S", hours: 1.5 },
  { day: "S", hours: 0.8 },
];

const maxHours = Math.max(...weekData.map(d => d.hours));

const stats = [
  { icon: Flame, label: "Study Streak", value: "12 days", color: "text-destructive" },
  { icon: Clock, label: "This Week", value: "16.8 hrs", color: "text-primary" },
  { icon: Target, label: "Goals Hit", value: "85%", color: "text-success" },
];

export function AnalyticsDemo() {
  return (
    <div className="space-y-5">
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-3 rounded-xl glass border border-border/30"
          >
            <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
            <p className="font-display font-bold text-sm">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Study Hours This Week</span>
          <span className="flex items-center gap-1 text-success">
            <TrendingUp className="h-3 w-3" /> +23%
          </span>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-28 p-3 rounded-xl glass border border-border/30">
          {weekData.map((data, i) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.hours / maxHours) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="w-full rounded-t-md gradient-primary min-h-[4px]"
              />
              <span className="text-[10px] text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress ring */}
      <div className="flex items-center gap-4 p-3 rounded-xl glass border border-border/30">
        <div className="relative">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/30" />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={97.4}
              initial={{ strokeDashoffset: 97.4 }}
              animate={{ strokeDashoffset: 97.4 * 0.28 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(220, 100%, 60%)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">72%</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Weekly Goal Progress</p>
          <p className="text-xs text-muted-foreground">14.4 / 20 hours completed</p>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        📊 Track your progress and stay motivated with real-time insights
      </p>
    </div>
  );
}
