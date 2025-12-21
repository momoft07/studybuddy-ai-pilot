import { GlassCard } from "@/components/ui/glass-card";
import { Target } from "lucide-react";

export function HowItWorks() {
  const steps = [
    "Enter your course details and exam date",
    "Set your weekly available study hours",
    "Our AI generates a personalized daily schedule",
    "Track your progress and adjust as needed",
  ];

  return (
    <GlassCard variant="neon" className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg gradient-accent p-2">
          <Target className="h-5 w-5 text-accent-foreground" />
        </div>
        <h2 className="text-lg font-semibold">How it works</h2>
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary font-bold">{index + 1}.</span>
            {step}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
