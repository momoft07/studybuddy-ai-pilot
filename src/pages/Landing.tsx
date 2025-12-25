import { useState } from "react";
import { FeatureDemoDialog } from "@/components/landing/FeatureDemoDialog";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection, FeatureKey } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { StudyPlanDemo } from "@/components/landing/demos/StudyPlanDemo";
import { FlashcardDemo } from "@/components/landing/demos/FlashcardDemo";
import { TaskDemo } from "@/components/landing/demos/TaskDemo";
import { FocusDemo } from "@/components/landing/demos/FocusDemo";
import { CalendarDemo } from "@/components/landing/demos/CalendarDemo";
import { AnalyticsDemo } from "@/components/landing/demos/AnalyticsDemo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { BookOpen, Brain, CheckSquare, Timer, Calendar, TrendingUp } from "lucide-react";

const featureData = {
  "study-plan": { icon: BookOpen, title: "AI Study Plans", description: "Get personalized study schedules based on your courses and deadlines", variant: "primary" as const },
  "flashcards": { icon: Brain, title: "Smart Flashcards", description: "Spaced repetition algorithm to maximize memory retention", variant: "accent" as const },
  "tasks": { icon: CheckSquare, title: "Task Tracking", description: "Stay organized with daily checklists and habit tracking", variant: "teal" as const },
  "focus": { icon: Timer, title: "Focus Mode", description: "Pomodoro timer with distraction-free study sessions", variant: "primary" as const },
  "calendar": { icon: Calendar, title: "Smart Calendar", description: "Visual overview of deadlines and study sessions", variant: "accent" as const },
  "analytics": { icon: TrendingUp, title: "Progress Analytics", description: "Track your study streaks and improvement over time", variant: "teal" as const },
};

const demoComponents: Record<FeatureKey, React.ComponentType> = {
  "study-plan": StudyPlanDemo,
  "flashcards": FlashcardDemo,
  "tasks": TaskDemo,
  "focus": FocusDemo,
  "calendar": CalendarDemo,
  "analytics": AnalyticsDemo,
};

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState<FeatureKey | null>(null);

  const activeFeature = activeDemo ? featureData[activeDemo] : null;
  const DemoComponent = activeDemo ? demoComponents[activeDemo] : null;

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated blue sky gradient background */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(135, 206, 250)"
        gradientBackgroundEnd="rgb(70, 130, 180)"
        firstColor="255, 255, 255"
        secondColor="173, 216, 230"
        thirdColor="135, 206, 235"
        fourthColor="176, 224, 230"
        fifthColor="240, 248, 255"
        pointerColor="200, 230, 255"
        size="100%"
        blendingValue="soft-light"
        interactive={true}
        containerClassName="!fixed !h-screen"
        className="absolute inset-0 z-0"
      />

      {/* Navigation with animated sky visible through glassmorphism */}
      <LandingNavbar />

      {/* Main Content - above gradient */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Features Section */}
        <FeaturesSection onFeatureClick={setActiveDemo} />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </main>

      {/* Feature Demo Dialog */}
      {activeFeature && DemoComponent && (
        <FeatureDemoDialog
          open={!!activeDemo}
          onOpenChange={(open) => !open && setActiveDemo(null)}
          title={activeFeature.title}
          description={activeFeature.description}
          icon={activeFeature.icon}
          variant={activeFeature.variant}
        >
          <DemoComponent />
        </FeatureDemoDialog>
      )}
    </div>
  );
}
