import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  Download,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";

interface StudyTask {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

interface DaySchedule {
  day: number;
  date: string;
  topics: string[];
  duration: number;
  sessionType: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  id?: string;
  title: string;
  description: string;
  totalDays: number;
  hoursPerWeek: number;
  dailySchedule: DaySchedule[];
  tips: string[];
  generatedAt?: string;
  courseName?: string;
  examDate?: string;
}

interface StudyPlanDisplayProps {
  plan: StudyPlan;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateProgress: (dayIndex: number, taskId: string, completed: boolean) => void;
}

export function StudyPlanDisplay({
  plan,
  onEdit,
  onDelete,
  onUpdateProgress,
}: StudyPlanDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([0]);

  const toggleDay = (dayIndex: number) => {
    setExpandedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const totalTasks = plan.dailySchedule.reduce(
    (acc, day) => acc + day.tasks.length,
    0
  );
  const completedTasks = plan.dailySchedule.reduce(
    (acc, day) => acc + day.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleExportPDF = () => {
    // Create a simple text export (could be enhanced with jsPDF)
    const content = `
${plan.title}
${plan.description}

Schedule:
${plan.dailySchedule
  .map(
    (day) => `
Day ${day.day} - ${day.date}
Topics: ${day.topics.join(", ")}
Duration: ${day.duration} minutes
Tasks:
${day.tasks.map((t) => `  - ${t.completed ? "✓" : "○"} ${t.title} (${t.duration} min)`).join("\n")}
`
  )
  .join("\n")}

Tips:
${plan.tips.map((tip) => `• ${tip}`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header with Progress */}
      <GlassCard className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {plan.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Study Plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {Math.round(progressPercentage)}% Complete
            </span>
            <span className="text-muted-foreground">
              {completedTasks} of {totalTasks} tasks
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Meta info */}
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {plan.totalDays} days
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {plan.hoursPerWeek} hrs/week
          </span>
        </div>
      </GlassCard>

      {/* Daily Schedule */}
      <div className="space-y-2">
        <AnimatePresence>
          {plan.dailySchedule.map((day, dayIndex) => {
            const dayCompleted = day.tasks.every((t) => t.completed);
            const isExpanded = expandedDays.includes(dayIndex);

            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.05 }}
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleDay(dayIndex)}>
                  <GlassCard className={`p-0 overflow-hidden ${dayCompleted ? "border-primary/30" : ""}`}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          {dayCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div className="text-left">
                            <p className="font-medium">
                              Day {day.day}{" "}
                              <span className="text-muted-foreground font-normal">
                                — {format(new Date(day.date), "EEE, MMM d")}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {day.topics.slice(0, 2).join(", ")}
                              {day.topics.length > 2 && ` +${day.topics.length - 2} more`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {day.duration} min
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t border-border pt-4 space-y-3">
                        {day.tasks.map((task) => (
                          <label
                            key={task.id}
                            className={`flex items-center gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer transition-all hover:bg-muted/50 ${
                              task.completed ? "opacity-70" : ""
                            }`}
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={(checked) =>
                                onUpdateProgress(dayIndex, task.id, checked as boolean)
                              }
                            />
                            <div className="flex-1">
                              <p className={task.completed ? "line-through text-muted-foreground" : ""}>
                                {task.title}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.duration} min
                            </span>
                          </label>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </GlassCard>
                </Collapsible>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <GlassCard variant="neon" className="p-4">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            Study Tips
          </h4>
          <ul className="space-y-2">
            {plan.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </motion.div>
  );
}
