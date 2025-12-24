import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <GlassCard variant="neon" className="p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm text-primary font-medium">Join 10,000+ students worldwide</span>
            </div>
            
            <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl mb-4">
              Start achieving more today
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto mb-6 md:mb-8">
              Join students at top universities who have transformed their academic performance with StudyPilot.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?signup=true">
                <GradientButton size="lg" className="min-w-[200px] pulse-glow">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
              </Link>
              <p className="text-xs text-muted-foreground">
                No credit card required
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Pro Teaser */}
        <div className="mt-12 text-center">
          <GlassCard className="inline-block px-6 py-4 md:px-8 md:py-5">
            <p className="text-sm md:text-base font-medium mb-1">
              <span className="gradient-text">Coming Soon: StudyPilot Pro</span>
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              Unlimited AI plans, calendar sync, priority support, and group study rooms
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
