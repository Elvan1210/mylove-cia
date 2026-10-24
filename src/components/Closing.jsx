import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Clock, Compass } from "lucide-react";
import { config } from "../config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const FLOATING_EMOJIS = ["🤗", "💋", "❤️", "🌹", "💕", "✨"];
const CONFETTI_COLORS = ["#F9D5DC", "#B76E79", "#C8102E", "#ff69b4", "#FFD700"];

export default function Closing({ onReplay }) {
  // Live Real-Time Stopwatch (Days, Hours, Minutes, Seconds)
  const [timeTogether, setTimeTogether] = useState(() => calculateTimeTogether());
  const [messageIndex, setMessageIndex] = useState(0);
  const [activeMessage, setActiveMessage] = useState(null);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const messageTimeoutRef = useRef(null);

  function calculateTimeTogether() {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: config.timezone })
    );
    const anniversary = new Date(config.anniversaryDate + "T00:00:00");
    const diffMs = Math.max(0, now - anniversary);

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }

  // Update real-time counter every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTogether(calculateTimeTogether());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup message timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleParticleComplete = useCallback((id) => {
    setFloatingParticles((prev) =>
      prev.filter((particle) => particle.id !== id)
    );
  }, []);

  const handleSendHug = useCallback(() => {
    try {
      let heartShape;
      if (typeof confetti.shapeFromPath === "function") {
        try {
          heartShape = confetti.shapeFromPath({
            path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -75,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
          });
        } catch {
          // ignore
        }
      }

      const shapes = heartShape ? [heartShape, "circle"] : ["circle"];

      confetti({
        particleCount: 40,
        angle: 60,
        spread: 60,
        origin: { x: 0.15, y: 0.75 },
        colors: CONFETTI_COLORS,
        shapes,
      });

      confetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: 0.85, y: 0.75 },
        colors: CONFETTI_COLORS,
        shapes,
      });

      confetti({
        particleCount: 60,
        spread: 90,
        origin: { x: 0.5, y: 0.65 },
        colors: CONFETTI_COLORS,
        shapes,
        scalar: 1.2,
      });
    } catch {
      // ignore
    }

    const newParticles = Array.from({ length: 14 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      emoji:
        FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)],
      left: Math.floor(Math.random() * 84) + 8,
      duration: 2.2 + Math.random() * 1.2,
      delay: Math.random() * 0.35,
      size: Math.floor(Math.random() * 12) + 24,
      drift: (Math.random() - 0.5) * 60,
      rotate: (Math.random() - 0.5) * 45,
    }));

    setFloatingParticles((prev) => [...prev.slice(-30), ...newParticles]);

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.vibrate === "function"
      ) {
        navigator.vibrate(200);
      }
    } catch {
      // ignore
    }

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

  const milestones = config.milestones || [];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center relative">
      {/* Floating emojis overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                y: "100vh",
                x: 0,
                scale: 0.6,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: "-10vh",
                x: particle.drift,
                scale: 1,
                rotate: particle.rotate,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut",
                times: [0, 0.15, 0.8, 1],
              }}
              onAnimationComplete={() => handleParticleComplete(particle.id)}
              style={{
                position: "absolute",
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

      {/* Main Content with Staggered Entrance */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center space-y-6"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-soft-pink/50 text-cherry text-xs font-medium mb-3 border border-rose-gold/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Journey & Forever</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-center text-text-main leading-snug font-bold">
            {config.closingTitle}
          </h1>
        </motion.div>

        {/* 2 Years Campus Story Narrative Card */}
        <motion.div
          variants={itemVariants}
          className="w-full glass rounded-3xl p-6 sm:p-7 shadow-md border border-rose-gold/30 text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3 text-rose-gold">
            <Compass className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold font-serif">
              Awal Mula Takdir
            </span>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-text-main leading-relaxed border-l-2 border-rose-gold/50 pl-4 py-1">
            "{config.closingStoryIntro}"
          </p>
        </motion.div>

        {/* Milestone Timeline */}
        <motion.div variants={itemVariants} className="w-full text-left">
          <div className="flex items-center gap-2 mb-3 justify-center text-xs uppercase tracking-wider font-semibold text-rose-gold">
            <span>Babak Perjalanan Kita</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="glass rounded-2xl p-4 border border-rose-gold/20 flex flex-col justify-between hover:bg-white/80 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-soft-pink/60 text-cherry">
                      {m.badge}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-text-main mb-1">
                    {m.title}
                  </h4>
                  <p className="text-xs text-text-main/75 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Real-Time Love Timer */}
        <motion.div
          variants={itemVariants}
          className="w-full glass rounded-3xl p-6 shadow-md border border-rose-gold/30 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-gold mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{config.closingLiveTimerTitle}</span>
          </div>

          {/* Time Blocks */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm my-1">
            <div className="flex flex-col items-center bg-white/85 rounded-2xl py-3 px-1 border border-soft-pink shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-cherry font-sans tabular-nums">
                {timeTogether.days}
              </span>
              <span className="text-[10px] sm:text-xs text-text-main/60 uppercase font-medium mt-0.5">
                Hari
              </span>
            </div>
            <div className="flex flex-col items-center bg-white/85 rounded-2xl py-3 px-1 border border-soft-pink shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-cherry font-sans tabular-nums">
                {String(timeTogether.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-text-main/60 uppercase font-medium mt-0.5">
                Jam
              </span>
            </div>
            <div className="flex flex-col items-center bg-white/85 rounded-2xl py-3 px-1 border border-soft-pink shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-cherry font-sans tabular-nums">
                {String(timeTogether.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-text-main/60 uppercase font-medium mt-0.5">
                Menit
              </span>
            </div>
            <div className="flex flex-col items-center bg-white/85 rounded-2xl py-3 px-1 border border-soft-pink shadow-sm">
              <span className="text-2xl sm:text-3xl font-bold text-cherry font-sans tabular-nums animate-pulse">
                {String(timeTogether.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-text-main/60 uppercase font-medium mt-0.5">
                Detik
              </span>
            </div>
          </div>

          <p className="font-script text-rose-gold text-base sm:text-lg mt-3 text-center">
            {config.closingSubtext}
          </p>
        </motion.div>

        {/* Send Hug Button & Message Section */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col items-center"
        >
          <motion.button
            type="button"
            onClick={handleSendHug}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-cherry text-white font-medium rounded-full min-h-12 px-8 py-3.5 shadow-lg shadow-cherry/25 hover:shadow-xl hover:bg-cherry/90 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>{config.closingSendButton}</span>
          </motion.button>

          {/* Feedback message that appears for 3 seconds */}
          <div className="min-h-[3.5rem] flex items-center justify-center w-full mt-3">
            <AnimatePresence mode="wait">
              {activeMessage && (
                <motion.div
                  key={activeMessage}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="glass px-5 py-2.5 rounded-2xl shadow-sm border border-rose-gold/20 text-text-main text-xs sm:text-sm font-medium max-w-sm text-center"
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
            className="text-xs sm:text-sm text-rose-gold underline underline-offset-4 hover:text-cherry transition-colors duration-200 cursor-pointer p-2"
          >
            {config.closingReplayButton}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
