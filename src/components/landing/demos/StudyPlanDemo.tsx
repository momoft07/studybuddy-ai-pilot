import { useState } from "react";
import { Check, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const samplePlan = [
  { id: 1, time: "9:00 AM", subject: "Calculus", task: "Chapter 5 Review", duration: "45 min", done: false },
  { id: 2, time: "10:00 AM", subject: "Physics", task: "Problem Set 3", duration: "30 min", done: false },
  { id: 3, time: "11:00 AM", subject: "History", task: "Essay Outline", duration: "25 min", done: true },
];

export function StudyPlanDemo() {
  const [tasks, setTasks] = useState(samplePlan);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Today's Study Plan</p>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
          {completedCount}/{tasks.length} done
        </span>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleTask(task.id)}
              className={`group cursor-pointer p-3 rounded-xl border transition-all duration-300 ${
                task.done 
                  ? "bg-success/10 border-success/30" 
                  : "glass border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  task.done 
                    ? "bg-success text-white" 
                    : "border-2 border-muted-foreground/50 group-hover:border-primary"
                }`}>
                  {task.done && <Check className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : ""}`}>
                      {task.task}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {task.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {task.time} · {task.duration}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-center text-muted-foreground pt-2">
        ✨ Click tasks to mark complete — AI adapts your schedule daily!
      </p>
    </div>
  );
}
