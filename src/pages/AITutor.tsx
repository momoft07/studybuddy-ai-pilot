import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";

export default function AITutorPage() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-display font-bold"><span className="gradient-text">AI Tutor</span></h1>
        <GlassCard variant="neon" className="py-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-muted-foreground mb-4">Get personalized tutoring powered by AI</p>
          <Link to="/premium"><GradientButton><Crown className="mr-2 h-4 w-4" /> Upgrade to Premium</GradientButton></Link>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
