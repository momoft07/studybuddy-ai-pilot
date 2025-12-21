import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";

const sampleCards = [
  { q: "What is the powerhouse of the cell?", a: "Mitochondria" },
  { q: "What year did World War II end?", a: "1945" },
  { q: "What is the chemical formula for water?", a: "H₂O" },
];

export function FlashcardDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const currentCard = sampleCards[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (correct: boolean) => {
    setScore(prev => ({
      ...prev,
      [correct ? "correct" : "incorrect"]: prev[correct ? "correct" : "incorrect"] + 1
    }));
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % sampleCards.length);
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Card {currentIndex + 1} of {sampleCards.length}
        </span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-success">✓ {score.correct}</span>
          <span className="text-destructive">✗ {score.incorrect}</span>
        </div>
      </div>

      <div 
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-44 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 glass rounded-xl p-5 flex flex-col items-center justify-center backface-hidden border border-primary/30"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-center font-medium">{currentCard.q}</p>
            <span className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Tap to reveal
            </span>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 glass rounded-xl p-5 flex flex-col items-center justify-center backface-hidden border border-success/30"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-2xl font-display font-bold gradient-text">{currentCard.a}</p>
            <span className="text-xs text-muted-foreground mt-2">Did you get it right?</span>
          </div>
        </motion.div>
      </div>

      {isFlipped && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3"
        >
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
          >
            <ThumbsDown className="h-4 w-4" /> Missed it
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" /> Got it!
          </button>
        </motion.div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        🧠 Spaced repetition means you see harder cards more often
      </p>
    </div>
  );
}
