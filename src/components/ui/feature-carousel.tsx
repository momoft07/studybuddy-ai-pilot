'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  benefit: string;
  icon: LucideIcon;
  variant: 'primary' | 'accent' | 'teal';
  onClick?: () => void;
}

interface FeatureCarouselProps {
  features: FeatureCardProps[];
}

export default function FeatureCarousel({ features }: FeatureCarouselProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const shift = (direction: 'next' | 'prev') => {
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % features.length
        : (currentIndex - 1 + features.length) % features.length;
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      let position = i - currentIndex;
      if (position < -Math.floor(features.length / 2)) {
        position += features.length;
      } else if (position > Math.floor(features.length / 2)) {
        position -= features.length;
      }

      const x = position * 320;
      const y = position === 0 ? 20 : 0;
      const scale = position === 0 ? 1.03 : 0.95;
      const opacity = Math.abs(position) > 2 ? 0 : 1;

      if (Math.abs(position) > 2) {
        gsap.set(card, { x, y, scale, opacity });
      } else {
        gsap.to(card, {
          x,
          y,
          scale,
          opacity,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });
  }, [currentIndex, features.length]);

  const badgeColors = {
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-purple-600 text-white',
    teal: 'bg-teal-500 text-white',
  };

  const gradientBg = {
    primary: 'from-primary/20 via-primary/10 to-transparent',
    accent: 'from-purple-500/20 via-purple-500/10 to-transparent',
    teal: 'from-teal-500/20 via-teal-500/10 to-transparent',
  };

  const iconBg = {
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-purple-500/20 text-purple-400',
    teal: 'bg-teal-500/20 text-teal-400',
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-8 py-10">
      <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute transition-transform cursor-pointer"
            onClick={feature.onClick}
          >
            <div className="group relative w-[300px] h-[360px] rounded-3xl overflow-hidden border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-all duration-300">
              {/* Gradient Background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-b opacity-60",
                gradientBg[feature.variant]
              )} />

              {/* Icon Section */}
              <div className="relative z-10 flex items-center justify-center pt-12 pb-6">
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center",
                  iconBg[feature.variant]
                )}>
                  <feature.icon className="w-10 h-10" />
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full",
                  badgeColors[feature.variant]
                )}>
                  {feature.variant === 'primary' ? 'AI' : feature.variant === 'accent' ? 'Smart' : 'Pro'}
                </span>
              </div>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {feature.subtitle}
                  </p>
                  <p className="text-xs text-primary/80 mt-1">
                    ✨ {feature.benefit}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Try it out</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="flex gap-4">
        <button
          onClick={() => shift('prev')}
          className="p-3 rounded-full border border-border bg-background hover:bg-muted hover:scale-110 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => shift('next')}
          className="p-3 rounded-full border border-border bg-background hover:bg-muted hover:scale-110 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
