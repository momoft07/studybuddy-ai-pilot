import { useState } from "react";
import { Link } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";
import { FeatureDemoDialog } from "@/components/landing/FeatureDemoDialog";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection, FeatureKey } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { StudyPlanDemo } from "@/components/landing/demos/StudyPlanDemo";
import { FlashcardDemo } from "@/components/landing/demos/FlashcardDemo";
import { TaskDemo } from "@/components/landing/demos/TaskDemo";
import { FocusDemo } from "@/components/landing/demos/FocusDemo";
import { CalendarDemo } from "@/components/landing/demos/CalendarDemo";
import { AnalyticsDemo } from "@/components/landing/demos/AnalyticsDemo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import {
  Sparkles,
  BookOpen,
  Brain,
  CheckSquare,
  Timer,
  Calendar,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeFeature = activeDemo ? featureData[activeDemo] : null;
  const DemoComponent = activeDemo ? demoComponents[activeDemo] : null;

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated gradient background */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(25, 25, 40)"
        gradientBackgroundEnd="rgb(10, 10, 25)"
        firstColor="124, 58, 237"
        secondColor="236, 72, 153"
        thirdColor="56, 189, 248"
        fourthColor="34, 197, 94"
        fifthColor="251, 191, 36"
        pointerColor="140, 100, 255"
        size="80%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="!fixed !h-screen"
        className="absolute inset-0 z-0"
      />

      {/* Navigation */}
      <header className="relative z-20 border-b border-border/30 glass-strong sticky top-0">
        <div className="container mx-auto flex h-16 md:h-18 items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl gradient-primary glow-sm">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold gradient-text">StudyPilot</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <GradientButton variant="ghost" size="sm">
                Sign In
              </GradientButton>
            </Link>
            <Link to="/auth?signup=true">
              <GradientButton size="sm">Get Started</GradientButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 glass rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-strong border-b border-border/30 p-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <GradientButton variant="ghost" className="w-full justify-center">
                  Sign In
                </GradientButton>
              </Link>
              <Link to="/auth?signup=true" onClick={() => setMobileMenuOpen(false)}>
                <GradientButton className="w-full justify-center">Get Started</GradientButton>
              </Link>
            </div>
          </div>
        )}
      </header>

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
