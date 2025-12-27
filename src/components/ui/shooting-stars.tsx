import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
  delay: number;
  size: number;
}

interface ShootingStarsProps {
  className?: string;
  frequency?: number; // Average ms between stars
  color?: string;
}

export function ShootingStars({ 
  className = "", 
  frequency = 3000,
  color = "255, 255, 255"
}: ShootingStarsProps) {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  useEffect(() => {
    const createStar = () => {
      const newStar: ShootingStar = {
        id: idCounter,
        startX: Math.random() * 100,
        startY: Math.random() * 40, // Start in upper portion
        angle: 25 + Math.random() * 20, // Angle between 25-45 degrees
        duration: 0.8 + Math.random() * 0.6, // 0.8-1.4 seconds
        delay: 0,
        size: 1 + Math.random() * 2,
      };

      setStars(prev => [...prev, newStar]);
      setIdCounter(prev => prev + 1);

      // Remove star after animation
      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== newStar.id));
      }, (newStar.duration + 0.5) * 1000);
    };

    // Random interval for natural feeling
    const scheduleNext = () => {
      const nextDelay = frequency * 0.5 + Math.random() * frequency;
      return setTimeout(() => {
        createStar();
        const timeoutId = scheduleNext();
        return () => clearTimeout(timeoutId);
      }, nextDelay);
    };

    // Initial star after short delay
    const initialTimeout = setTimeout(createStar, 1000);
    const intervalId = scheduleNext();

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(intervalId);
    };
  }, [frequency, idCounter]);

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute"
            initial={{ 
              left: `${star.startX}%`, 
              top: `${star.startY}%`,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{ 
              left: `${star.startX + 30}%`,
              top: `${star.startY + 30}%`,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.3],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: star.duration,
              ease: "easeOut",
            }}
            style={{
              transform: `rotate(${star.angle}deg)`,
            }}
          >
            {/* Star head */}
            <div 
              className="relative"
              style={{
                width: `${star.size * 4}px`,
                height: `${star.size * 4}px`,
              }}
            >
              {/* Glow */}
              <div 
                className="absolute rounded-full blur-sm"
                style={{
                  width: `${star.size * 8}px`,
                  height: `${star.size * 8}px`,
                  left: `-${star.size * 2}px`,
                  top: `-${star.size * 2}px`,
                  background: `radial-gradient(circle, rgba(${color}, 0.8) 0%, rgba(${color}, 0) 70%)`,
                }}
              />
              {/* Core */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: `${star.size * 3}px`,
                  height: `${star.size * 3}px`,
                  left: `${star.size * 0.5}px`,
                  top: `${star.size * 0.5}px`,
                  background: `rgba(${color}, 1)`,
                  boxShadow: `0 0 ${star.size * 4}px rgba(${color}, 0.8)`,
                }}
              />
            </div>
            
            {/* Tail */}
            <motion.div
              className="absolute"
              style={{
                right: `${star.size * 4}px`,
                top: `${star.size * 1.5}px`,
                width: '100px',
                height: `${star.size}px`,
                background: `linear-gradient(to left, rgba(${color}, 0.8), rgba(${color}, 0.3), rgba(${color}, 0))`,
                borderRadius: '50%',
                transformOrigin: 'right center',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 1.5, 1, 0.5],
                opacity: [0, 0.8, 0.6, 0],
              }}
              transition={{ 
                duration: star.duration,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
