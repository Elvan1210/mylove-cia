import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { config } from "../config";

export default function LoveMeter({ onNext }) {
  const [loveValue, setLoveValue] = useState(20);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [isEvaded, setIsEvaded] = useState(false);
  const [evadeCount, setEvadeCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [isEasterEgg, setIsEasterEgg] = useState(false);

  const cardRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const easterEggTimerRef = useRef(null);
  const hasFiredConfetti = useRef(false);

  // Dynamic reaction text based on slider value
  const getReactionText = (val) => {
    if (val <= 20) return config.loveReactions.low;
    if (val <= 50) return config.loveReactions.medium;
    if (val <= 80) return config.loveReactions.high;
    if (val < 100) return config.loveReactions.veryHigh;
    return config.loveReactions.max;
  };

  // Calculate random clamped position for the evading button
  const calculateRandomPosition = useCallback(() => {
    const buttonWidth = 140;
    const buttonHeight = 48;
    const margin = 60;

    const vw = typeof window !== "undefined" ? window.innerWidth : 800;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;

    const minX = margin;
    const maxX = Math.max(minX, vw - buttonWidth - margin);
    const minY = margin;
    const maxY = Math.max(minY, vh - buttonHeight - margin);

    const cardRect = cardRef.current?.getBoundingClientRect();

    // Try up to 50 attempts to find a position that does not overlap the center card
    for (let attempt = 0; attempt < 50; attempt++) {
      const candidateX = Math.floor(minX + Math.random() * (maxX - minX));
      const candidateY = Math.floor(minY + Math.random() * (maxY - minY));

      if (cardRect) {
        const cardPadding = 15;
        const overlapsCardX =
          candidateX < cardRect.right + cardPadding &&
          candidateX + buttonWidth > cardRect.left - cardPadding;
        const overlapsCardY =
          candidateY < cardRect.bottom + cardPadding &&
          candidateY + buttonHeight > cardRect.top - cardPadding;

        if (overlapsCardX && overlapsCardY) {
          continue;
        }
      }

      // Avoid jumping to almost the exact same location if possible
      if (isEvaded) {
        const dist = Math.hypot(
          candidateX - buttonPos.x,
          candidateY - buttonPos.y
        );
        if (dist < 100 && (maxX - minX > 150 || maxY - minY > 150)) {
          continue;
        }
      }

      return { x: candidateX, y: candidateY };
    }

    // Fallback: safely place above or below the center card
    if (cardRect) {
      if (cardRect.top > buttonHeight + margin + 10) {
        return {
          x: Math.floor(minX + Math.random() * (maxX - minX)),
          y: minY,
        };
      }
      if (vh - cardRect.bottom > buttonHeight + margin + 10) {
        return {
          x: Math.floor(minX + Math.random() * (maxX - minX)),
          y: maxY,
        };
      }
    }

    return { x: minX, y: maxY };
  }, [isEvaded, buttonPos.x, buttonPos.y]);

  // Handle evasive maneuver
  const handleEvade = useCallback(
    (e) => {
      if (loveValue >= 100) return;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const newPos = calculateRandomPosition();
      setButtonPos(newPos);
      setIsEvaded(true);

      const message =
        config.evadingToasts[
          Math.min(evadeCount, config.evadingToasts.length - 1)
        ];
      setToastMessage(message);
      setEvadeCount((prev) => prev + 1);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
    },
    [loveValue, evadeCount, calculateRandomPosition]
  );

  // Keep button clamped within viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isEvaded) return;
      const buttonWidth = 140;
      const buttonHeight = 48;
      const margin = 60;
      const maxX = Math.max(margin, window.innerWidth - buttonWidth - margin);
      const maxY = Math.max(margin, window.innerHeight - buttonHeight - margin);

      setButtonPos((prev) => ({
        x: Math.min(Math.max(prev.x, margin), maxX),
        y: Math.min(Math.max(prev.y, margin), maxY),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isEvaded]);

  // Slider change handler
  const handleSliderChange = (e) => {
    setLoveValue(Number(e.target.value));
  };

  // Confetti when reaching 100
  useEffect(() => {
    if (loveValue === 100) {
      setIsEvaded(false);
      if (!hasFiredConfetti.current) {
        hasFiredConfetti.current = true;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F9D5DC", "#B76E79", "#C8102E", "#FCE8EC"],
        });
      }
    } else {
      hasFiredConfetti.current = false;
    }
  }, [loveValue]);

  // Easter egg: stay at 100 for 3 seconds -> 1000% 💯
  useEffect(() => {
    if (loveValue === 100) {
      easterEggTimerRef.current = setTimeout(() => {
        setIsEasterEgg(true);
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#F9D5DC", "#B76E79", "#C8102E", "#FCE8EC"],
        });
      }, 3000);
    } else {
      if (easterEggTimerRef.current) {
        clearTimeout(easterEggTimerRef.current);
        easterEggTimerRef.current = null;
      }
      setIsEasterEgg(false);
    }

    return () => {
      if (easterEggTimerRef.current) {
        clearTimeout(easterEggTimerRef.current);
      }
    };
  }, [loveValue]);

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
      {/* Center Card */}
      <div
        ref={cardRef}
        className="w-full glass rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-gold/20 flex flex-col items-center relative"
      >
        {/* Header */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-main mb-2 tracking-tight">
          {config.heroTitle}
        </h1>
        <p className="text-text-main/70 text-sm sm:text-base mb-6 leading-relaxed">
          {config.heroSubtitle}
        </p>

        {/* Question */}
        <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-4">
          {config.loveQuestion}
        </h2>

        {/* Percentage Display */}
        <div className="h-20 flex items-center justify-center select-none">
          <motion.div
            key={isEasterEgg ? "egg" : "normal"}
            initial={isEasterEgg ? { scale: 0.3 } : false}
            animate={
              isEasterEgg
                ? { scale: [0.3, 1.25, 0.95, 1.08, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className={`text-6xl font-bold text-cherry tracking-tight transition-transform duration-300 ${
              loveValue === 100 ? "animate-pulse-heart" : ""
            }`}
          >
            {isEasterEgg ? "1000% 💯" : `${loveValue}%`}
          </motion.div>
        </div>

        {/* Custom Range Slider */}
        <div className="w-full px-2 my-4">
          <input
            type="range"
            min="0"
            max="100"
            value={loveValue}
            onChange={handleSliderChange}
            aria-label={config.loveQuestion}
            aria-valuenow={loveValue}
            aria-valuemin="0"
            aria-valuemax="100"
            className="w-full h-3 cursor-pointer select-none"
          />
          <div className="flex justify-between text-xs text-text-main/60 mt-2 px-1 select-none font-medium">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Dynamic Reaction Text */}
        <div className="min-h-[3.25rem] flex items-center justify-center my-3 px-2">
          <p
            aria-live="polite"
            className="text-base sm:text-lg font-medium text-rose-gold text-center transition-all duration-300"
          >
            {getReactionText(loveValue)}
          </p>
        </div>

        {/* Action Button Container */}
        <div className="w-full flex justify-center mt-4 min-h-[52px] items-center">
          {loveValue < 100 ? (
            <button
              type="button"
              aria-label={config.nextButtonText}
              onPointerEnter={handleEvade}
              onTouchStart={handleEvade}
              onPointerDown={handleEvade}
              onFocus={handleEvade}
              onClick={(e) => {
                e.preventDefault();
                handleEvade(e);
              }}
              style={
                isEvaded
                  ? {
                      position: "fixed",
                      left: `${buttonPos.x}px`,
                      top: `${buttonPos.y}px`,
                      zIndex: 50,
                      transition:
                        "left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }
                  : undefined
              }
              className="px-8 py-3.5 rounded-full bg-cherry text-warm-cream font-semibold text-base shadow-lg shadow-cherry/25 hover:bg-cherry/90 active:scale-95 cursor-pointer select-none"
            >
              {config.nextButtonText}
            </button>
          ) : (
            <motion.button
              type="button"
              aria-label={config.unlockButtonText}
              onClick={() => onNext?.()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: [
                  "0 4px 15px rgba(200, 16, 46, 0.3)",
                  "0 8px 25px rgba(200, 16, 46, 0.5)",
                  "0 4px 15px rgba(200, 16, 46, 0.3)",
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="px-8 py-3.5 rounded-full bg-cherry text-warm-cream font-semibold text-base shadow-lg shadow-cherry/30 hover:bg-cherry/90 cursor-pointer select-none"
            >
              {config.unlockButtonText}
            </motion.button>
          )}
        </div>
      </div>

      {/* Evading Toast Notification */}
      <AnimatePresence mode="wait">
        {toastMessage && (
          <motion.div
            key={toastMessage + evadeCount}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] px-6 py-3 rounded-full bg-text-main text-warm-cream text-sm sm:text-base font-medium shadow-2xl flex items-center justify-center text-center pointer-events-none"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
