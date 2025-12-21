import { Link } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Sparkles,
  BookOpen,
  Brain,
  CheckSquare,
  Timer,
  Calendar,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "AI Study Plans",
    description: "Get personalized study schedules based on your courses and deadlines",
    variant: "primary" as const,
  },
  {
    icon: Brain,
    title: "Smart Flashcards",
    description: "Spaced repetition algorithm to maximize memory retention",
    variant: "accent" as const,
  },
  {
    icon: CheckSquare,
    title: "Task Tracking",
    description: "Stay organized with daily checklists and habit tracking",
    variant: "teal" as const,
  },
  {
    icon: Timer,
    title: "Focus Mode",
    description: "Pomodoro timer with distraction-free study sessions",
    variant: "primary" as const,
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Visual overview of deadlines and study sessions",
    variant: "accent" as const,
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Track your study streaks and improvement over time",
    variant: "teal" as const,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="orb orb-primary h-[500px] w-[500px] top-[-10%] left-[-10%]" />
        <div className="orb orb-accent h-[400px] w-[400px] bottom-[10%] right-[-5%]" style={{ animationDelay: "2s" }} />
        <div className="orb orb-secondary h-[300px] w-[300px] top-[40%] right-[30%]" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-border/30 glass-strong">
        <div className="container mx-auto flex h-18 items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary glow-sm">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">StudyPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <GradientButton variant="ghost" size="sm">
                Sign In
              </GradientButton>
            </Link>
            <Link to="/auth?signup=true">
              <GradientButton size="sm">Get Started</GradientButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm border border-primary/30">
              <Zap className="h-4 w-4 text-primary icon-glow" />
              <span className="text-muted-foreground">AI-Powered Study Assistant</span>
              <span className="ml-2 rounded-full gradient-primary px-2 py-0.5 text-xs font-semibold text-white">New</span>
            </div>
            
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
              Study Smarter,
              <br />
              <span className="gradient-text">Not Harder</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Your AI-powered study companion that creates personalized study plans, 
              generates flashcards, and helps you <span className="text-primary font-medium">ace your exams</span>.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pt-4">
              <Link to="/auth?signup=true">
                <GradientButton size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
              </Link>
              <Link to="/auth">
                <GradientButton variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Sign In
                </GradientButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              {[
                { value: "10K+", label: "Students" },
                { value: "500K+", label: "Flashcards Created" },
                { value: "98%", label: "Pass Rate" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl mb-4">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven tools designed for students, by students
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const iconVariants = {
                primary: "gradient-primary shadow-[0_0_20px_hsl(220_100%_60%/0.4)]",
                accent: "gradient-accent shadow-[0_0_20px_hsl(270_100%_65%/0.4)]",
                teal: "gradient-teal shadow-[0_0_20px_hsl(180_100%_50%/0.4)]",
              };
              
              return (
                <GlassCard
                  key={feature.title}
                  hover
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-3 ${iconVariants[feature.variant]}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <GlassCard variant="neon" className="p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
                Ready to transform your study habits?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of students who are studying smarter with StudyPilot
              </p>
              <Link to="/auth?signup=true">
                <GradientButton size="lg" className="min-w-[220px]">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 StudyPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}