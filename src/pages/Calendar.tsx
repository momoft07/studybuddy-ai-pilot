import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-display font-bold"><span className="gradient-text">Calendar</span></h1>
        <GlassCard className="py-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Calendar View Coming Soon</h3>
          <p className="text-muted-foreground">View all your deadlines and study sessions in one place</p>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
