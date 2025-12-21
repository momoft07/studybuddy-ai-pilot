import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";
import { ArrowRight, Zap, Shield, Users, Award } from "lucide-react";

const rotatingTexts = [
  "Stop guessing what to study next.",
  "Never miss a deadline again.",
  "Ace exams without burning out.",
  "Turn chaos into clarity.",
];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative z-10 py-16 md:py-28 lg:py-36">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm border border-primary/30">
            <Zap className="h-4 w-4 text-primary icon-glow" />
            <span className="text-muted-foreground">AI-Powered Study Assistant</span>
            <span className="ml-2 rounded-full gradient-primary px-2 py-0.5 text-xs font-semibold text-white">New</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
            Study Smarter,
            <br />
            <span className="gradient-text">Not Harder</span>
          </h1>
          
          {/* Pain Point Sub-headline */}
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
            Tired of cramming? Overwhelmed by deadlines? Let AI build your perfect study schedule — so you can focus on <span className="text-primary font-medium">learning, not planning</span>.
          </p>

          {/* Rotating Text */}
          <div className="h-8 flex items-center justify-center">
            <p 
              className={`text-sm md:text-base text-accent font-medium transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              {rotatingTexts[currentTextIndex]}
            </p>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pt-4">
            <Link to="/auth?signup=true">
              <GradientButton size="lg" className="w-full sm:w-auto min-w-[240px] pulse-glow">
                🚀 Start Free Trial — No Card Needed
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
            <Link to="/auth">
              <GradientButton variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                🔑 Sign In to Continue
              </GradientButton>
            </Link>
          </div>

          {/* Urgency Microcopy */}
          <p className="text-xs text-muted-foreground">
            Free trial ends in 7 days — claim your AI study plan now!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-6">
            {[
              { value: "10K+", label: "Students" },
              { value: "500K+", label: "Flashcards Created" },
              { value: "98%", label: "Pass Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span>Data Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-accent" />
              <span>Trusted by Universities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-secondary" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-12 md:mt-16 mx-auto max-w-3xl">
          <div className="glass rounded-2xl p-4 md:p-6 neon-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-destructive/80" />
              <div className="h-3 w-3 rounded-full bg-warning/80" />
              <div className="h-3 w-3 rounded-full bg-success/80" />
              <span className="ml-2 text-xs text-muted-foreground">StudyPilot Demo</span>
            </div>
            <div className="aspect-video rounded-lg bg-muted/30 flex items-center justify-center relative overflow-hidden">
              {/* Animated Demo Visualization */}
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="relative z-10 text-center space-y-4 p-4">
                <div className="flex items-center justify-center gap-2 animate-fade-in">
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Generating study plan...</p>
                    <p className="text-xs text-muted-foreground">Psychology 101 • Exam Dec 28</p>
                  </div>
                </div>
                <div className="w-full max-w-xs mx-auto">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full gradient-primary animate-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
                <p className="text-xs text-primary">See how it works in 10 seconds ✨</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
