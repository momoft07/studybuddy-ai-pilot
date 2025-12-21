import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Calendar as CalendarIcon, Plus, Clock, BookOpen } from "lucide-react";

export default function CalendarPage() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold md:text-3xl">
              <span className="gradient-text">Calendar</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              View all your deadlines and study sessions
            </p>
          </div>
          <GradientButton>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </GradientButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard variant="neon" className="lg:col-span-2 py-12 text-center">
            <div className="rounded-full gradient-primary p-4 mx-auto w-fit mb-6 glow-primary">
              <CalendarIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calendar View Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              A beautiful calendar interface to visualize your study schedule, deadlines, and events
            </p>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg gradient-primary p-2">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Upcoming</h3>
              </div>
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg gradient-accent p-2">
                  <BookOpen className="h-4 w-4 text-accent-foreground" />
                </div>
                <h3 className="font-semibold">Study Sessions</h3>
              </div>
              <p className="text-sm text-muted-foreground">No sessions scheduled</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
