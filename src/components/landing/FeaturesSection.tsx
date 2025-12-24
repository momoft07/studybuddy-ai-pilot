import {
  BookOpen,
  Brain,
  CheckSquare,
  Timer,
  Calendar,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import FeatureCarousel from "@/components/ui/feature-carousel";

type FeatureKey = "study-plan" | "flashcards" | "tasks" | "focus" | "calendar" | "analytics";

interface Feature {
  key: FeatureKey;
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
  variant: "primary" | "accent" | "teal";
}

const features: Feature[] = [
  {
    key: "study-plan",
    icon: BookOpen,
    title: "AI Study Plans",
    description: "Get personalized study schedules based on your courses and deadlines",
    benefit: "AI generates optimal daily plans — users report 40% less stress",
    variant: "primary",
  },
  {
    key: "flashcards",
    icon: Brain,
    title: "Smart Flashcards",
    description: "Spaced repetition algorithm to maximize memory retention",
    benefit: "Spaced repetition algorithm boosts retention by 70%",
    variant: "accent",
  },
  {
    key: "tasks",
    icon: CheckSquare,
    title: "Task Tracking",
    description: "Stay organized with daily checklists and habit tracking",
    benefit: "Never miss a deadline — auto-syncs with your calendar",
    variant: "teal",
  },
  {
    key: "focus",
    icon: Timer,
    title: "Focus Mode",
    description: "Pomodoro timer with distraction-free study sessions",
    benefit: "Proven Pomodoro technique increases productivity by 25%",
    variant: "primary",
  },
  {
    key: "calendar",
    icon: Calendar,
    title: "Smart Calendar",
    description: "Visual overview of deadlines and study sessions",
    benefit: "Visualize your entire semester at a glance",
    variant: "accent",
  },
  {
    key: "analytics",
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Track your study streaks and improvement over time",
    benefit: "Data-driven insights help you study smarter",
    variant: "teal",
  },
];

interface FeaturesSectionProps {
  onFeatureClick: (key: FeatureKey) => void;
}

export function FeaturesSection({ onFeatureClick }: FeaturesSectionProps) {
  const carouselFeatures = features.map((feature) => ({
    title: feature.title,
    subtitle: feature.description,
    benefit: feature.benefit,
    icon: feature.icon,
    variant: feature.variant,
    onClick: () => onFeatureClick(feature.key),
  }));

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
            Everything you need to <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven tools designed for students, by students. <span className="text-primary">Click to try them!</span>
          </p>
        </div>
        
        <FeatureCarousel features={carouselFeatures} />
      </div>
    </section>
  );
}

export type { FeatureKey };
