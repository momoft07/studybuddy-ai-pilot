import { GlassCard } from "@/components/ui/glass-card";
import {
  BookOpen,
  Brain,
  CheckSquare,
  Timer,
  Calendar,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FeatureKey = "study-plan" | "flashcards" | "tasks" | "focus" | "calendar" | "analytics";

interface Feature {
  key: FeatureKey;
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
  variant: "primary" | "accent" | "teal";
  cta: string;
}

const features: Feature[] = [
  {
    key: "study-plan",
    icon: BookOpen,
    title: "AI Study Plans",
    description: "Get personalized study schedules based on your courses and deadlines",
    benefit: "AI generates optimal daily plans — users report 40% less stress",
    variant: "primary",
    cta: "Try it out →",
  },
  {
    key: "flashcards",
    icon: Brain,
    title: "Smart Flashcards",
    description: "Spaced repetition algorithm to maximize memory retention",
    benefit: "Spaced repetition algorithm boosts retention by 70%",
    variant: "accent",
    cta: "Flip a card →",
  },
  {
    key: "tasks",
    icon: CheckSquare,
    title: "Task Tracking",
    description: "Stay organized with daily checklists and habit tracking",
    benefit: "Never miss a deadline — auto-syncs with your calendar",
    variant: "teal",
    cta: "Manage tasks →",
  },
  {
    key: "focus",
    icon: Timer,
    title: "Focus Mode",
    description: "Pomodoro timer with distraction-free study sessions",
    benefit: "Proven Pomodoro technique increases productivity by 25%",
    variant: "primary",
    cta: "Start focusing →",
  },
  {
    key: "calendar",
    icon: Calendar,
    title: "Smart Calendar",
    description: "Visual overview of deadlines and study sessions",
    benefit: "Visualize your entire semester at a glance",
    variant: "accent",
    cta: "View calendar →",
  },
  {
    key: "analytics",
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Track your study streaks and improvement over time",
    benefit: "Data-driven insights help you study smarter",
    variant: "teal",
    cta: "See your stats →",
  },
];

interface FeaturesSectionProps {
  onFeatureClick: (key: FeatureKey) => void;
}

export function FeaturesSection({ onFeatureClick }: FeaturesSectionProps) {
  const iconVariants = {
    primary: "gradient-primary shadow-[0_0_20px_hsl(220_100%_60%/0.4)]",
    accent: "gradient-accent shadow-[0_0_20px_hsl(270_100%_65%/0.4)]",
    teal: "gradient-teal shadow-[0_0_20px_hsl(180_100%_50%/0.4)]",
  };

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
            Everything you need to <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven tools designed for students, by students. <span className="text-primary">Click to try them!</span>
          </p>
        </div>
        
        <TooltipProvider>
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Tooltip key={feature.title}>
                <TooltipTrigger asChild>
                  <div>
                    <GlassCard
                      hover
                      className="animate-fade-in cursor-pointer group h-full"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => onFeatureClick(feature.key)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`rounded-xl p-3 ${iconVariants[feature.variant]} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                          <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-base md:text-lg mb-1">{feature.title}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                          <p className="text-xs text-primary/80 mt-2 line-clamp-1">
                            ✨ {feature.benefit}
                          </p>
                          <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {feature.cta}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{feature.benefit}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}

export type { FeatureKey };
