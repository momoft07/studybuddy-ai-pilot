import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    role: "Medical Student, UCLA",
    avatar: "SM",
    quote: "I went from a 2.8 GPA to Dean's List using StudyPilot. The AI plans actually work!",
    rating: 5,
  },
  {
    name: "James T.",
    role: "Engineering Major, MIT",
    avatar: "JT",
    quote: "Finally, an app that understands how students actually study. Game changer for exam prep.",
    rating: 5,
  },
  {
    name: "Emily R.",
    role: "Psychology Major, NYU",
    avatar: "ER",
    quote: "The spaced repetition flashcards helped me retain 3x more information. Worth every minute!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative z-10 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl mb-2">
            Loved by <span className="gradient-text">10,000+ Students</span>
          </h2>
          <p className="text-sm text-muted-foreground">Real results from real students</p>
        </div>

        {/* Mobile: Single rotating testimonial */}
        <div className="md:hidden">
          <GlassCard className="p-6">
            <Quote className="h-8 w-8 text-primary/30 mb-3" />
            <p className="text-sm leading-relaxed mb-4">
              "{testimonials[currentIndex].quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                {testimonials[currentIndex].avatar}
              </div>
              <div>
                <p className="text-sm font-medium">{testimonials[currentIndex].name}</p>
                <p className="text-xs text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-3">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
          </GlassCard>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid of testimonials */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <GlassCard 
              key={testimonial.name} 
              hover 
              className="p-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="h-8 w-8 text-primary/30 mb-3" />
              <p className="text-sm leading-relaxed mb-4">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
