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
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "AI Study Plans",
    description: "Get personalized study schedules based on your courses and deadlines",
  },
  {
    icon: Brain,
    title: "Smart Flashcards",
    description: "Spaced repetition algorithm to maximize memory retention",
  },
  {
    icon: CheckSquare,
    title: "Task Tracking",
    description: "Stay organized with daily checklists and habit tracking",
  },
  {
    icon: Timer,
    title: "Focus Mode",
    description: "Pomodoro timer with distraction-free study sessions",
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Visual overview of deadlines and study sessions",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Track your study streaks and improvement over time",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-border/50 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary glow-sm">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">StudyPilot</span>
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
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">AI-Powered Study Assistant</span>
            </div>
            
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Study Smarter,
              <br />
              <span className="gradient-text">Not Harder</span>
            </h1>
            
            <p className="mx-auto max-w-xl text-lg text-muted-foreground md:text-xl">
              Your AI-powered study companion that creates personalized study plans, 
              generates flashcards, and helps you ace your exams.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/auth?signup=true">
                <GradientButton size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
              </Link>
              <Link to="/auth">
                <GradientButton variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Powerful tools designed for students, by students
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <GlassCard
                key={feature.title}
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg gradient-primary p-2.5">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <GlassCard variant="neon" className="p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Ready to transform your study habits?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of students who are studying smarter with StudyPilot
            </p>
            <Link to="/auth?signup=true" className="mt-6 inline-block">
              <GradientButton size="lg">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 StudyPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
