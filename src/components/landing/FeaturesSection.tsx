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
    title: "Smart Study Plans",
    description: "Personalized schedules that adapt to your goals and deadlines",
    benefit: "40% reduction in study-related stress",
    variant: "primary",
  },
  {
    key: "flashcards",
    icon: Brain,
    title: "Intelligent Flashcards",
    description: "Spaced repetition optimized for long-term memory",
    benefit: "70% improvement in retention rates",
    variant: "accent",
  },
  {
    key: "tasks",
    icon: CheckSquare,
    title: "Task Management",
    description: "Organize assignments with smart prioritization",
    benefit: "Automatic deadline synchronization",
    variant: "teal",
  },
  {
    key: "focus",
    icon: Timer,
    title: "Deep Focus Mode",
    description: "Distraction-free sessions with proven techniques",
    benefit: "25% increase in productivity",
    variant: "primary",
  },
  {
    key: "calendar",
    icon: Calendar,
    title: "Visual Calendar",
    description: "See your entire semester at a glance",
    benefit: "Complete schedule visibility",
    variant: "accent",
  },
  {
    key: "analytics",
    icon: TrendingUp,
    title: "Progress Insights",
    description: "Track performance and identify opportunities",
    benefit: "Data-driven study optimization",
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
            Powerful tools built for how students actually learn. Click any feature to explore.
          </p>
        </div>
        
        <FeatureCarousel features={carouselFeatures} />
      </div>
    </section>
  );
}

export type { FeatureKey };
