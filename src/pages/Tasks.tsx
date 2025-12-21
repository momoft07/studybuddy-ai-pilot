import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CheckSquare,
  Plus,
  Loader2,
  Circle,
  CheckCircle2,
  Calendar,
  Flag,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
}

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user?.id)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        user_id: user?.id,
        title: newTask.title,
        priority: newTask.priority,
        due_date: newTask.dueDate || null,
      });

      if (error) throw error;

      toast.success("Task created!");
      setNewTask({ title: "", priority: "medium", dueDate: "" });
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          status: newStatus,
          completed_at: newStatus === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", taskId);

      if (error) throw error;

      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

      toast.success("Task deleted");
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive bg-destructive/20";
      case "medium":
        return "text-warning bg-warning/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold md:text-3xl">
              <span className="gradient-text">Tasks</span> & Habits
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay organized and track your progress
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <GradientButton>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </GradientButton>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <Select
                  value={newTask.priority}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
                <GradientButton onClick={handleCreateTask} className="w-full">
                  Create Task
                </GradientButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "pending", "completed"] as const).map((f) => (
            <GradientButton
              key={f}
              variant={filter === f ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </GradientButton>
          ))}
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "Create your first task to get started"
                : filter === "completed"
                ? "Complete some tasks to see them here"
                : "All tasks are completed! 🎉"}
            </p>
            {filter === "all" && (
              <GradientButton onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </GradientButton>
            )}
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <GlassCard
                key={task.id}
                hover
                className="flex items-center gap-4 group"
              >
                <button
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      task.status === "completed"
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.due_date && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(task.due_date), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <Flag className="h-3 w-3" />
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
