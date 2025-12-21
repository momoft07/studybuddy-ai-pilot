import { useState } from "react";
import { Check, GripVertical, Plus } from "lucide-react";
import { motion, Reorder } from "framer-motion";

const initialTasks = [
  { id: "1", text: "Read Chapter 12", done: false, priority: "high" },
  { id: "2", text: "Complete practice problems", done: true, priority: "medium" },
  { id: "3", text: "Review lecture notes", done: false, priority: "low" },
];

export function TaskDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { 
      id: Date.now().toString(), 
      text: newTask, 
      done: false, 
      priority: "medium" 
    }]);
    setNewTask("");
  };

  const priorityColors = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-warning/20 text-warning",
    low: "bg-muted text-muted-foreground",
  };

  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Today's Tasks</p>
        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-2">
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className={`group flex items-center gap-2 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
              task.done 
                ? "bg-success/5 border-success/20" 
                : "glass border-border/50 hover:border-primary/50"
            }`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                task.done 
                  ? "bg-success text-white" 
                  : "border-2 border-muted-foreground/50 hover:border-primary"
              }`}
            >
              {task.done && <Check className="h-3 w-3" />}
            </button>
            <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}>
              {task.text}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
              {task.priority}
            </span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          onClick={addTask}
          className="p-2 rounded-lg gradient-primary text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        ✋ Drag to reorder • Click to complete • Type to add
      </p>
    </div>
  );
}
