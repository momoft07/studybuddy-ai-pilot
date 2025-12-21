import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GradientButton } from "@/components/ui/gradient-button";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Flame,
  Target,
  BookOpen,
  Brain,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
}

interface Profile {
  full_name: string | null;
  streak_count: number;
  progress_score: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, streak_count, progress_score")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch today's tasks
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data: tasksData } = await supabase
        .from("tasks")
        .select("id, title, status, priority, due_date")
        .eq("user_id", user?.id)
        .gte("due_date", startOfDay)
        .lte("due_date", endOfDay)
        .order("priority", { ascending: false })
        .limit(5);

      if (tasksData) {
        setTodaysTasks(tasksData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    
    const { error } = await supabase
      .from("tasks")
      .update({ 
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("id", taskId);

    if (!error) {
      setTodaysTasks(tasks =>
        tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.full_name?.split(" ")[0] || "Student";
  const completedTasks = todaysTasks.filter(t => t.status === "completed").length;
  const totalTasks = todaysTasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold md:text-3xl">
              {getGreeting()}, <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Link to="/study-plan">
            <GradientButton>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Study Plan
            </GradientButton>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Current Streak"
            value={`${profile?.streak_count || 0} days`}
            icon={Flame}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Progress Score"
            value={profile?.progress_score || 0}
            subtitle="out of 100"
            icon={Target}
          />
          <StatCard
            title="Study Sessions"
            value="0"
            subtitle="this week"
            icon={Clock}
          />
          <StatCard
            title="Cards Reviewed"
            value="0"
            subtitle="today"
            icon={Brain}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Tasks */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today's Tasks</h2>
              <Link to="/tasks">
                <GradientButton variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </GradientButton>
              </Link>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No tasks for today</p>
                <Link to="/tasks">
                  <GradientButton variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </GradientButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className="flex-shrink-0"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === "high"
                          ? "bg-destructive/20 text-destructive"
                          : task.priority === "medium"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Progress Ring */}
          <GlassCard className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Today's Progress</h2>
            <ProgressRing value={taskProgress} size={160} strokeWidth={12}>
              <span className="text-xs text-muted-foreground mt-1">
                {completedTasks}/{totalTasks} tasks
              </span>
            </ProgressRing>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              {taskProgress === 100
                ? "Amazing! You've completed all tasks! 🎉"
                : taskProgress > 50
                ? "Great progress! Keep going! 💪"
                : "Let's get started! 🚀"}
            </p>
          </GlassCard>
        </div>

        {/* Calendar Widget Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CalendarWidget />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/notes" className="block">
            <GlassCard hover className="flex items-center gap-4">
              <div className="rounded-lg gradient-primary p-3">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Add Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Summarize your study material
                </p>
              </div>
            </GlassCard>
          </Link>
          <Link to="/flashcards" className="block">
            <GlassCard hover className="flex items-center gap-4">
              <div className="rounded-lg gradient-accent p-3">
                <Brain className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Study Flashcards</h3>
                <p className="text-sm text-muted-foreground">
                  Review with spaced repetition
                </p>
              </div>
            </GlassCard>
          </Link>
          <Link to="/focus" className="block">
            <GlassCard hover className="flex items-center gap-4">
              <div className="rounded-lg bg-success p-3">
                <Clock className="h-6 w-6 text-success-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Focus Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Start a Pomodoro session
                </p>
              </div>
            </GlassCard>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
