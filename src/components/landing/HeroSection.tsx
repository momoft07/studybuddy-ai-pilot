import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedShaderBackground } from "@/components/ui/animated-shader-background";
import { ParticleField } from "@/components/ui/particle-field";
import { ArrowRight, Zap, Shield, Users, Award, BookOpen, Brain, CheckCircle2, Calendar, TrendingUp, Timer } from "lucide-react";

const rotatingTexts = [
  "Know exactly what to study, when to study it.",
  "Your deadlines, managed automatically.",
  "Better grades with less stress.",
  "From overwhelmed to in control.",
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
    <section className="relative z-10 min-h-screen">
      {/* WebGL Shader Background */}
      <AnimatedShaderBackground className="absolute inset-0 z-0" />
      
      {/* Particle Field Overlay */}
      <ParticleField 
        className="absolute inset-0 z-[1]" 
        particleCount={60}
        color="200, 180, 255"
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 py-16 md:py-28 lg:py-36">
        <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm border border-primary/30"
          >
            <Zap className="h-4 w-4 text-primary icon-glow" />
            <span className="text-muted-foreground">AI-Powered Study Platform</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl lg:text-8xl"
          >
            Change the way
            <br />
            <span className="gradient-text">you study</span>
          </motion.h1>
          
          {/* Pain Point Sub-headline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed"
          >
            Exam prep, daily planning, deep focus. Everything you need to succeed academically, in one intelligent platform.
          </motion.p>

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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pt-4"
          >
            <Link to="/auth?signup=true">
              <GradientButton size="lg" className="w-full sm:w-auto min-w-[200px] pulse-glow">
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
            <Link to="/auth">
              <GradientButton variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px]">
                Sign in
              </GradientButton>
            </Link>
          </motion.div>

          {/* Urgency Microcopy */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs text-muted-foreground"
          >
            No credit card required. Start studying smarter today.
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-6"
          >
            {[
              { value: "10,000+", label: "Active students" },
              { value: "500,000+", label: "Study sessions" },
              { value: "98%", label: "Success rate" },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 text-xs text-muted-foreground"
          >
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
          </motion.div>
        </div>

        {/* Animated Dashboard Hook */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 md:mt-24 mx-auto max-w-5xl relative"
        >
          {/* Main Dashboard Preview */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl opacity-50 rounded-3xl" />
            
            {/* Dashboard Container */}
            <div className="relative glass rounded-2xl md:rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-warning/60" />
                  <div className="h-3 w-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                    app.studypilot.io
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-4 md:p-8 bg-gradient-to-br from-background/80 via-background/60 to-background/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Left Column - Study Plan */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="md:col-span-2 space-y-4"
                  >
                    {/* Today's Plan Card */}
                    <div className="glass rounded-xl p-4 border border-border/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Today's Study Plan</p>
                            <p className="text-xs text-muted-foreground">3 sessions scheduled</p>
                          </div>
                        </div>
                        <span className="text-xs text-primary font-medium">On track</span>
                      </div>
                      
                      {/* Study Sessions */}
                      <div className="space-y-2">
                        {[
                          { subject: "Psychology 101", time: "9:00 AM", duration: "45 min", completed: true },
                          { subject: "Organic Chemistry", time: "2:00 PM", duration: "60 min", completed: false },
                          { subject: "Statistics Review", time: "7:00 PM", duration: "30 min", completed: false },
                        ].map((session, i) => (
                          <motion.div
                            key={session.subject}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 1.4 + i * 0.15 }}
                            className={`flex items-center justify-between p-3 rounded-lg ${session.completed ? 'bg-success/10 border border-success/20' : 'bg-muted/30'}`}
                          >
                            <div className="flex items-center gap-3">
                              {session.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                              )}
                              <div>
                                <p className={`text-sm font-medium ${session.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                  {session.subject}
                                </p>
                                <p className="text-xs text-muted-foreground">{session.time}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{session.duration}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                      className="glass rounded-xl p-4 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Weekly Progress</span>
                        <span className="text-sm text-primary font-semibold">67%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '67%' }}
                          transition={{ duration: 1, delay: 2, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Right Column - Stats & Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="space-y-4"
                  >
                    {/* Streak Card */}
                    <div className="glass rounded-xl p-4 border border-border/30 text-center">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent/70 mb-2"
                      >
                        <TrendingUp className="h-6 w-6 text-white" />
                      </motion.div>
                      <p className="text-2xl font-bold gradient-text">12 Days</p>
                      <p className="text-xs text-muted-foreground">Study Streak</p>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="glass rounded-xl p-4 border border-border/30 space-y-2">
                      {[
                        { icon: Brain, label: "Review Flashcards", count: "24 due" },
                        { icon: Timer, label: "Start Focus Session", count: "" },
                        { icon: BookOpen, label: "Continue Reading", count: "Ch. 5" },
                      ].map((action, i) => (
                        <motion.div
                          key={action.label}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        >
                          <action.icon className="h-4 w-4 text-primary" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-foreground">{action.label}</p>
                          </div>
                          {action.count && (
                            <span className="text-xs text-muted-foreground">{action.count}</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-4 md:-right-8 glass rounded-xl p-3 border border-border/50 shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Goal Achieved</p>
                  <p className="text-xs text-muted-foreground">2 hours studied</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 md:-left-8 glass rounded-xl p-3 border border-border/50 shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">AI Suggestion</p>
                  <p className="text-xs text-muted-foreground">Review Ch. 3 today</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
