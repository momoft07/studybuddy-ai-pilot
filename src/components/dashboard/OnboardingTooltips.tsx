import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, Clock, Target } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  targetSelector?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "study-plan",
    title: "Generate AI Study Plan",
    description: "Click here to create your first personalized study schedule.",
    icon: Sparkles,
  },
  {
    id: "tasks",
    title: "Track Your Tasks",
    description: "Check off tasks to track your progress and earn streaks.",
    icon: CheckCircle2,
  },
  {
    id: "focus",
    title: "Focus Mode",
    description: "Use Pomodoro sessions to stay focused and productive.",
    icon: Clock,
  },
  {
    id: "goals",
    title: "Set Your Goals",
    description: "Set weekly study targets and track your achievements.",
    icon: Target,
  },
];

export function OnboardingTooltips() {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const storedLoginCount = localStorage.getItem("studypilot-login-count");
    const loginCount = storedLoginCount ? parseInt(storedLoginCount, 10) : 0;
    const hasCompletedOnboarding = localStorage.getItem("studypilot-onboarding-complete");

    // Update login count
    localStorage.setItem("studypilot-login-count", String(loginCount + 1));

    // Show onboarding for first 3 logins
    if (loginCount < 3 && !hasCompletedOnboarding) {
      setTimeout(() => setCurrentStep(0), 1500);
    }
  }, []);

  const handleNext = () => {
    if (currentStep !== null && currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("studypilot-onboarding-complete", "true");
    setCurrentStep(null);
    setDismissed(true);
  };

  const handleDismiss = () => {
    setCurrentStep(null);
    setDismissed(true);
  };

  if (dismissed || currentStep === null) return null;

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
      >
        <div className="glass-strong rounded-2xl p-5 glow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <step.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <GradientButton variant="ghost" size="sm" onClick={handleDismiss}>
                Skip
              </GradientButton>
              <GradientButton size="sm" onClick={handleNext}>
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Got it!" : "Next"}
              </GradientButton>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
