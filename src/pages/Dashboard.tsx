import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { WeeklyGoalProgress } from "@/components/dashboard/WeeklyGoalProgress";
import { StudyHoursChart } from "@/components/dashboard/StudyHoursChart";
import { DynamicWelcome } from "@/components/dashboard/DynamicWelcome";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { AnimatedProgressRing } from "@/components/dashboard/AnimatedProgressRing";
import { WhatToDoNext } from "@/components/dashboard/WhatToDoNext";
import { AchievementBadge } from "@/components/dashboard/AchievementBadge";
import { WeeklyRecap } from "@/components/dashboard/WeeklyRecap";
import { SmartFocusButton } from "@/components/dashboard/SmartFocusButton";
import { OnboardingTooltips } from "@/components/dashboard/OnboardingTooltips";
import { TrendIndicator } from "@/components/dashboard/TrendIndicator";
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
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

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
  weekly_study_hours: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({ hours: 0, sessions: 0, goalsHit: 0 });
  const [previousWeekStats, setPreviousWeekStats] = useState({ hours: 0, sessions: 0 });
  const [flashcardsReviewed, setFlashcardsReviewed] = useState(0);
  const [flashcardsDueForReview, setFlashcardsDueForReview] = useState(0);
  const [hasStudyPlan, setHasStudyPlan] = useState(false);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);

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
        .select("full_name, streak_count, progress_score, weekly_study_hours")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Current week stats
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      
      // Previous week stats
      const prevWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }).toISOString();
      const prevWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }).toISOString();
      
      const { data: sessionsData } = await supabase
        .from("pomodoro_sessions")
        .select("duration_minutes, completed, started_at")
        .eq("user_id", user?.id)
        .gte("started_at", prevWeekStart)
        .lte("started_at", weekEnd);
      
      if (sessionsData) {
        // Current week
        const currentWeekSessions = sessionsData.filter(
          s => s.started_at >= weekStart && s.started_at <= weekEnd && s.completed
        );
        const totalMinutes = currentWeekSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
        const targetHours = profileData?.weekly_study_hours || 20;
        const goalsHitPercentage = Math.min(Math.round((totalMinutes / 60 / targetHours) * 100), 100);
        
        setWeeklyStats({
          hours: Number((totalMinutes / 60).toFixed(1)),
          sessions: currentWeekSessions.length,
          goalsHit: goalsHitPercentage,
        });

        // Previous week
        const prevWeekSessions = sessionsData.filter(
          s => s.started_at >= prevWeekStart && s.started_at <= prevWeekEnd && s.completed
        );
        const prevTotalMinutes = prevWeekSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
        
        setPreviousWeekStats({
          hours: Number((prevTotalMinutes / 60).toFixed(1)),
          sessions: prevWeekSessions.length,
        });
      }

      // Fetch flashcards reviewed today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const { data: flashcardsData } = await supabase
        .from("flashcards")
        .select("review_count, next_review_date")
        .eq("user_id", user?.id);
      
      if (flashcardsData) {
        const todayReviewed = flashcardsData.filter(
          f => f.next_review_date && new Date(f.next_review_date) <= new Date()
        );
        const total = flashcardsData.reduce((acc, f) => acc + (f.review_count || 0), 0);
        setFlashcardsReviewed(total);
        setFlashcardsDueForReview(todayReviewed.length);
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

      // Fetch total completed tasks for achievements
      const { count: completedCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("status", "completed");
      
      setTotalTasksCompleted(completedCount || 0);

      // Check for study plans
      const { data: studyPlans } = await supabase
        .from("study_plans")
        .select("id")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .limit(1);

      setHasStudyPlan(!!studyPlans && studyPlans.length > 0);
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

  const firstName = profile?.full_name?.split(" ")[0] || "Student";
  const completedTasks = todaysTasks.filter(t => t.status === "completed").length;
  const totalTasks = todaysTasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const topTask = todaysTasks.find(t => t.status !== "completed") || null;

  return (
    <AppLayout>
      {/* Achievement Badge Popup */}
      <AchievementBadge
        streakCount={profile?.streak_count || 0}
        goalsHit={weeklyStats.goalsHit}
        flashcardsReviewed={flashcardsReviewed}
        focusSessions={weeklyStats.sessions}
        hasStudyPlan={hasStudyPlan}
      />

      {/* Onboarding Tooltips */}
      <OnboardingTooltips />

      <div className="space-y-6 animate-fade-in">
        {/* Header with Dynamic Welcome */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <DynamicWelcome
            firstName={firstName}
            streakCount={profile?.streak_count || 0}
            weeklyHoursTarget={profile?.weekly_study_hours || 20}
            weeklyHoursCompleted={weeklyStats.hours}
            topTask={topTask}
            completedTasksToday={completedTasks}
            totalTasksToday={totalTasks}
          />
          <Link to="/study-plan">
            <GradientButton>
              <Sparkles className="mr-2 h-4 w-4" />
              {t("dashboard.generatePlan")}
            </GradientButton>
          </Link>
        </div>

        {/* Stats Grid with Trends */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("dashboard.studyStreak")}
            value={`${profile?.streak_count || 0} ${t("dashboard.days")}`}
            icon={Flame}
            trend={{ 
              value: profile?.streak_count && profile.streak_count > 0 ? 12 : 0, 
              isPositive: true 
            }}
          />
          <div className="relative">
            <StatCard
              title={t("dashboard.thisWeek")}
              value={`${weeklyStats.hours} ${t("dashboard.hrs")}`}
              subtitle={`${weeklyStats.sessions} ${t("dashboard.sessions")}`}
              icon={Clock}
            />
            <div className="absolute bottom-3 left-5">
              <TrendIndicator
                value={weeklyStats.hours}
                previousValue={previousWeekStats.hours}
              />
            </div>
          </div>
          <StatCard
            title={t("dashboard.goalsHit")}
            value={`${weeklyStats.goalsHit}%`}
            subtitle={t("dashboard.weeklyTarget")}
            icon={Target}
          />
          <StatCard
            title={t("dashboard.cardsReviewed")}
            value={flashcardsReviewed}
            subtitle={t("dashboard.total")}
            icon={Brain}
          />
        </div>

        {/* Weekly Recap - Collapsible */}
        <WeeklyRecap
          hoursStudied={weeklyStats.hours}
          targetHours={profile?.weekly_study_hours || 20}
          tasksCompleted={totalTasksCompleted}
          flashcardsReviewed={flashcardsReviewed}
          streakDays={profile?.streak_count || 0}
          previousWeekHours={previousWeekStats.hours}
        />

        {/* Study Hours Chart */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StudyHoursChart />
          </div>
          <WeeklyGoalProgress weeklyGoalHours={profile?.weekly_study_hours || 20} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Tasks with Rewards */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t("dashboard.todaysTasks")}</h2>
              <Link to="/tasks">
                <GradientButton variant="ghost" size="sm">
                  {t("common.viewAll")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </GradientButton>
              </Link>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">{t("common.noTasksToday")}</p>
                <Link to="/tasks">
                  <GradientButton variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("common.addTask")}
                  </GradientButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {todaysTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      status={task.status}
                      priority={task.priority}
                      dueDate={task.due_date}
                      onToggle={toggleTaskStatus}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </GlassCard>

          {/* Animated Progress Ring */}
          <GlassCard className="flex flex-col items-center justify-center relative overflow-visible">
            <AnimatedProgressRing
              value={taskProgress}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
            />
          </GlassCard>
        </div>

        {/* What to Do Next & Calendar */}
        <div className="grid gap-6 lg:grid-cols-3">
          <WhatToDoNext
            topTask={topTask}
            flashcardsToReview={flashcardsDueForReview}
            hasStudyPlan={hasStudyPlan}
          />
          <div className="lg:col-span-2">
            <CalendarWidget />
          </div>
        </div>

        {/* Quick Actions with Smart Focus */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/notes" className="block">
            <GlassCard hover className="flex items-center gap-4">
              <div className="rounded-lg gradient-primary p-3">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{t("dashboard.addNotes")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.summarizeMaterial")}
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
                <h3 className="font-semibold">{t("dashboard.studyFlashcards")}</h3>
                <p className="text-sm text-muted-foreground">
                  {flashcardsDueForReview > 0
                    ? `${flashcardsDueForReview} ${t("dashboard.cardsDueReview")}`
                    : t("dashboard.reviewSpaced")}
                </p>
              </div>
            </GlassCard>
          </Link>
          <SmartFocusButton topTask={topTask} />
        </div>
      </div>
    </AppLayout>
  );
}
