import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../config";

export default function Letter({ onNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);

  // Split letter text into paragraphs by double newline
  const paragraphs = config.letterText ? config.letterText.trim().split(/\n\n+/) : [];

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
  };

  // Switch to full opened letter view once envelope opening animation finishes
  useEffect(() => {
    if (isOpen && !isOpened) {
      const timer = setTimeout(() => {
        setIsOpened(true);
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isOpened]);

  // Handle skip animation
  const handleSkip = () => {
    setIsSkipped(true);
    setAllRevealed(true);
  };

  // If not skipped, reveal the next button after the sequential animation finishes
  useEffect(() => {
    if (isOpened && !isSkipped) {
      // 0.3s initial delay + 0.8s stagger per paragraph + 0.6s item fade duration
      const totalDuration = Math.round((0.3 + Math.max(0, paragraphs.length - 1) * 0.8 + 0.6) * 1000);
      const timer = setTimeout(() => {
        setAllRevealed(true);
      }, totalDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpened, isSkipped, paragraphs.length]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isSkipped ? 0 : 0.8,
        delayChildren: isSkipped ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isSkipped ? 0.01 : 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* ============================================================
             1. Closed Envelope Stage
             ============================================================ */
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div
              onClick={handleOpenEnvelope}
              className="relative cursor-pointer select-none group focus-visible:outline-rose-gold"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenEnvelope();
                }
              }}
              aria-label="Buka amplop surat cinta"
              style={{ perspective: 1200 }}
            >
              {/* Envelope Body Container */}
              <div className="relative w-72 sm:w-88 h-48 sm:h-56 bg-warm-cream rounded-2xl shadow-2xl border-2 border-rose-gold/50 overflow-visible transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Decorative border edges on envelope */}
                <div className="absolute inset-2 border border-dashed border-rose-gold/30 rounded-xl pointer-events-none z-20" />
                <span className="absolute top-2.5 left-2.5 text-rose-gold/50 text-xs select-none pointer-events-none z-20">❦</span>
                <span className="absolute top-2.5 right-2.5 text-rose-gold/50 text-xs select-none pointer-events-none z-20">❦</span>
                <span className="absolute bottom-2.5 left-2.5 text-rose-gold/50 text-xs select-none pointer-events-none z-20">❦</span>
                <span className="absolute bottom-2.5 right-2.5 text-rose-gold/50 text-xs select-none pointer-events-none z-20">❦</span>

                {/* Inner Envelope Lining Back */}
                <div className="absolute inset-0 bg-[#F5EDE3] rounded-2xl" />

                {/* Inside Letter Peek (slides up when opening) */}
                <motion.div
                  className="absolute inset-x-5 top-3 bg-warm-cream paper-texture rounded-t-lg shadow-md p-4 text-center border border-rose-gold/30 z-10"
                  initial={false}
                  animate={isOpen ? { y: -110, opacity: 1 } : { y: 0, opacity: 0.85 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeInOut" }}
                >
                  <p className="font-serif text-rose-gold text-sm font-semibold tracking-wide">
                    {config.letterSectionTitle}
                  </p>
                  <div className="mt-2 w-12 h-[1px] bg-rose-gold/30 mx-auto" />
                  <p className="font-script text-rose-gold text-lg mt-1">
                    Untuk {config.nickname || config.recipientName} 💌
                  </p>
                </motion.div>

                {/* Front Envelope Pocket Folds */}
                {/* Left triangle fold */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-b-2xl"
                  style={{
                    clipPath: "polygon(0 0, 49% 52%, 0 100%)",
                    background: "linear-gradient(135deg, #FFF8F0 0%, #F6ECE2 100%)",
                    borderLeft: "2px solid rgba(183, 110, 121, 0.35)",
                    borderBottom: "2px solid rgba(183, 110, 121, 0.35)",
                  }}
                />

                {/* Right triangle fold */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-b-2xl"
                  style={{
                    clipPath: "polygon(100% 0, 51% 52%, 100% 100%)",
                    background: "linear-gradient(225deg, #FFF8F0 0%, #F6ECE2 100%)",
                    borderRight: "2px solid rgba(183, 110, 121, 0.35)",
                    borderBottom: "2px solid rgba(183, 110, 121, 0.35)",
                  }}
                />

                {/* Bottom triangle fold */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-b-2xl"
                  style={{
                    clipPath: "polygon(0 100%, 50% 46%, 100% 100%)",
                    background: "linear-gradient(0deg, #FFF8F0 0%, #EFE3D6 100%)",
                    borderBottom: "2px solid rgba(183, 110, 121, 0.45)",
                  }}
                />

                {/* Rose-Gold Triangular Flap (Top) with 3D Flip */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-28 sm:h-32"
                  style={{
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ rotateX: 0 }}
                  animate={isOpen ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
                  transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Flap triangle surface */}
                  <div
                    className="w-full h-full shadow-md border-b-2 border-rose-gold/60"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(180deg, #D49B9F 0%, #B76E79 100%)",
                    }}
                  />

                  {/* Red Wax Seal with Heart Emoji in Center */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-cherry shadow-lg border-2 border-red-900/50 flex items-center justify-center cursor-pointer select-none"
                    animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="text-base sm:text-lg select-none leading-none" role="img" aria-label="cinta">
                      ❤️
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Tap to open hint */}
              <motion.p
                className="mt-6 text-center text-sm sm:text-base font-serif text-rose-gold tracking-wide flex items-center justify-center gap-2"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <span>Ketuk untuk membuka surat</span>
                <span className="text-sm">💌</span>
              </motion.p>
            </div>
          </motion.div>
        ) : (
          /* ============================================================
             2. Opened Letter Paper Content
             ============================================================ */
          <motion.div
            key="letter-content"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md mx-auto"
          >
            <div
              className="paper-texture rounded-2xl shadow-xl max-w-md w-full mx-auto p-6 sm:p-8 max-h-[82vh] overflow-y-auto relative border border-rose-gold/30"
              style={{ overscrollBehavior: "contain" }}
            >
              {/* Decorative Corner Flourishes */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-rose-gold/60 pointer-events-none rounded-tl-sm" />
              <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-rose-gold/40 pointer-events-none rounded-tl-sm" />

              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-rose-gold/60 pointer-events-none rounded-tr-sm" />
              <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-rose-gold/40 pointer-events-none rounded-tr-sm" />

              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-rose-gold/60 pointer-events-none rounded-bl-sm" />
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-rose-gold/40 pointer-events-none rounded-bl-sm" />

              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-rose-gold/60 pointer-events-none rounded-br-sm" />
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-rose-gold/40 pointer-events-none rounded-br-sm" />

              {/* Decorative Subtle Stars in Corners */}
              <span className="absolute top-3 left-3 text-rose-gold/40 text-[10px] select-none pointer-events-none">✦</span>
              <span className="absolute top-3 right-3 text-rose-gold/40 text-[10px] select-none pointer-events-none">✦</span>
              <span className="absolute bottom-3 left-3 text-rose-gold/40 text-[10px] select-none pointer-events-none">✦</span>
              <span className="absolute bottom-3 right-3 text-rose-gold/40 text-[10px] select-none pointer-events-none">✦</span>

              {/* Inner Decorative Border Frame */}
              <div className="absolute inset-2 sm:inset-3 border border-rose-gold/20 rounded-xl pointer-events-none" />

              {/* Letter Header */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-rose-gold/20 relative z-10">
                <div className="w-16 sm:w-20" />
                <h2 className="font-serif text-2xl sm:text-3xl text-rose-gold font-bold text-center tracking-wide">
                  {config.letterSectionTitle}
                </h2>
                <div className="w-16 sm:w-20 text-right">
                  {!allRevealed && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="text-xs text-rose-gold/80 hover:text-rose-gold underline transition-colors cursor-pointer whitespace-nowrap font-sans"
                    >
                      {config.letterSkipButton}
                    </button>
                  )}
                </div>
              </div>

              {/* Letter Paragraphs Container */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10"
              >
                {paragraphs.map((para, index) => {
                  const isSignature = index === paragraphs.length - 1;

                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      animate={isSkipped ? { opacity: 1, y: 0, transition: { duration: 0 } } : undefined}
                      className={
                        isSignature
                          ? "font-script text-rose-gold text-2xl sm:text-3xl text-right mt-6 pt-2 leading-relaxed select-text font-normal"
                          : "mb-4 text-base sm:text-lg leading-relaxed text-text-main font-normal select-text"
                      }
                    >
                      {para.split("\n").map((line, lIdx, arr) => (
                        <span key={lIdx}>
                          {line}
                          {lIdx < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Next Button Section */}
              <AnimatePresence>
                {allRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-8 pt-4 text-center border-t border-rose-gold/20 relative z-10"
                  >
                    <button
                      type="button"
                      onClick={onNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cherry text-warm-cream font-medium shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mx-auto text-base"
                    >
                      <span>{config.letterNextButton}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
