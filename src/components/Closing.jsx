import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { config } from '../config';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const FLOATING_EMOJIS = ['🤗', '💋', '❤️', '🌹', '💕'];
const CONFETTI_COLORS = ['#F9D5DC', '#B76E79', '#C8102E', '#ff69b4'];

export default function Closing({ onReplay }) {
  // Day counter calculation
  const [days] = useState(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: config.timezone }));
    const anniversary = new Date(config.anniversaryDate + 'T00:00:00');
    return Math.floor((now - anniversary) / (1000 * 60 * 60 * 24));
  });

  const [displayCount, setDisplayCount] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [activeMessage, setActiveMessage] = useState(null);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const messageTimeoutRef = useRef(null);

  // Animate counting up from 0 to days
  useEffect(() => {
    if (days <= 0) return;

    const duration = 1500; // 1.5 seconds
    const stepCount = Math.min(days, 50);
    const stepInterval = Math.max(25, Math.floor(duration / stepCount));
    const increment = days / (duration / stepInterval);

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= days) {
        setDisplayCount(days);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, stepInterval);

    return () => clearInterval(timer);
  }, [days]);

  // Cleanup message timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // Remove individual floating emoji when animation finishes
  const handleParticleComplete = useCallback((id) => {
    setFloatingParticles((prev) => prev.filter((particle) => particle.id !== id));
  }, []);

  // Send hug handler
  const handleSendHug = useCallback(() => {
    // a. Fire confetti with hearts & custom colors
    try {
      let heartShape;
      if (typeof confetti.shapeFromPath === 'function') {
        try {
          heartShape = confetti.shapeFromPath({
            path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -75,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
          });
        } catch {
          // ignore error if Path2D is unsupported
        }
      }

      const shapes = heartShape ? [heartShape, 'circle'] : ['circle'];

      // Left blast
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.75 },
        colors: CONFETTI_COLORS,
        shapes,
      });

      // Right blast
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.75 },
        colors: CONFETTI_COLORS,
        shapes,
      });

      // Center burst
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { x: 0.5, y: 0.65 },
        colors: CONFETTI_COLORS,
        shapes,
        scalar: 1.2,
      });
    } catch {
      // Confetti fallback
    }

    // b. Spawn floating emojis rising from bottom to top
    const newParticles = Array.from({ length: 14 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      emoji: FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)],
      left: Math.floor(Math.random() * 84) + 8, // 8% to 92%
      duration: 2.2 + Math.random() * 1.2,
      delay: Math.random() * 0.35,
      size: Math.floor(Math.random() * 12) + 24, // 24px - 36px
      drift: (Math.random() - 0.5) * 60,
      rotate: (Math.random() - 0.5) * 45,
    }));

    setFloatingParticles((prev) => [...prev.slice(-30), ...newParticles]);

    // c. Vibrate device if supported
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(200);
      }
    } catch {
      // Ignore vibration error
    }

    // d & e. Show rotating sent message for 3 seconds
    const sentMessages = config.closingSentMessages || [];
    if (sentMessages.length > 0) {
      const nextMsg = sentMessages[messageIndex % sentMessages.length];
      setMessageIndex((prev) => (prev + 1) % sentMessages.length);
      setActiveMessage(nextMsg);

      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      messageTimeoutRef.current = setTimeout(() => {
        setActiveMessage(null);
      }, 3000);
    }
  }, [messageIndex]);

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center justify-center text-center relative">
      {/* Floating emojis overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                y: '100vh',
                x: 0,
                scale: 0.6,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: '-10vh',
                x: particle.drift,
                scale: 1,
                rotate: particle.rotate,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeOut',
                times: [0, 0.15, 0.8, 1],
              }}
              onAnimationComplete={() => handleParticleComplete(particle.id)}
              style={{
                position: 'absolute',
                left: `${particle.left}%`,
                bottom: 0,
                fontSize: `${particle.size}px`,
                lineHeight: 1,
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main content with staggered entrance animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center space-y-6"
      >
        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-2xl sm:text-3xl text-center text-text-main leading-snug font-semibold"
        >
          {config.closingTitle}
        </motion.h1>

        {/* Day Counter Card */}
        <motion.div
          variants={itemVariants}
          className="w-full glass rounded-3xl p-6 shadow-sm border border-rose-gold/20 flex flex-col items-center justify-center"
        >
          {days <= 0 ? (
            <div className="text-xl sm:text-2xl font-bold text-cherry py-2">
              {config.closingCounterZero}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-sm sm:text-base text-text-main/80 font-medium tracking-wide">
                {config.closingCounterPrefix}
              </span>
              <span className="text-5xl sm:text-6xl font-bold text-cherry my-2 tracking-tight tabular-nums">
                {displayCount}
              </span>
              <span className="text-sm sm:text-base text-text-main/80 font-medium tracking-wide">
                {config.closingCounterSuffix}
              </span>
            </div>
          )}

          {/* Subtext */}
          <p className="font-script text-rose-gold text-lg sm:text-xl mt-3 text-center">
            {config.closingSubtext}
          </p>
        </motion.div>

        {/* Send Hug Button & Message Section */}
        <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
          <motion.button
            type="button"
            onClick={handleSendHug}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-cherry text-white font-medium rounded-full min-h-12 px-8 py-3.5 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex items-center justify-center text-base sm:text-lg"
          >
            {config.closingSendButton}
          </motion.button>

          {/* Feedback message that appears for 3 seconds */}
          <div className="min-h-[4rem] flex items-center justify-center w-full mt-3">
            <AnimatePresence mode="wait">
              {activeMessage && (
                <motion.div
                  key={activeMessage}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="glass px-5 py-2.5 rounded-2xl shadow-sm border border-rose-gold/20 text-text-main text-sm sm:text-base font-medium max-w-sm text-center"
                >
                  {activeMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Replay Button */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={() => onReplay?.()}
            className="text-sm text-rose-gold underline underline-offset-4 hover:text-cherry transition-colors duration-200 cursor-pointer p-2"
          >
            {config.closingReplayButton}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
