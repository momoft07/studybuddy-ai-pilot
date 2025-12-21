import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Crown, Check, Sparkles, Brain, FileText, Timer, Mic } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Tutoring", desc: "Get personalized help on any topic" },
  { icon: Brain, title: "Unlimited Flashcards", desc: "Create unlimited decks with spaced repetition" },
  { icon: FileText, title: "PDF Summarization", desc: "Upload and summarize study materials" },
  { icon: Timer, title: "Focus Mode", desc: "Distraction-free study sessions" },
  { icon: Mic, title: "Voice Input", desc: "Dictate notes hands-free" },
];

export default function PremiumPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-full gradient-accent p-3 mb-4 glow-accent">
            <Crown className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold"><span className="gradient-text">StudyPilot Premium</span></h1>
          <p className="text-muted-foreground mt-2">Unlock the full potential of AI-powered studying</p>
        </div>
        <GlassCard variant="neon" className="p-6">
          <div className="text-center mb-6">
            <span className="text-4xl font-bold gradient-text">€5</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <div className="space-y-3 mb-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="rounded-lg gradient-primary p-1.5"><f.icon className="h-4 w-4 text-primary-foreground" /></div>
                <div><p className="font-medium">{f.title}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
              </div>
            ))}
          </div>
          <GradientButton className="w-full" onClick={() => {}}>
            <Crown className="mr-2 h-4 w-4" /> Upgrade to Premium
          </GradientButton>
          <p className="text-xs text-center text-muted-foreground mt-4">Stripe integration coming soon</p>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
