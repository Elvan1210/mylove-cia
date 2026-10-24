import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";
import { config } from "../config";

export default function BirthdayCake({ onNext }) {
  const [isBlown, setIsBlown] = useState(false);

  const handleBlowCandle = () => {
    if (isBlown) return;
    setIsBlown(true);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F9D5DC", "#B76E79", "#C8102E", "#FFD700", "#FFF8F0"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
          colors: ["#F9D5DC", "#B76E79", "#C8102E", "#FFD700"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
          colors: ["#F9D5DC", "#B76E79", "#C8102E", "#FFD700"],
        });
      }, 300);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-soft-pink/50 text-cherry text-xs font-medium mb-3 border border-rose-gold/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Special Birthday Ritual</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-main tracking-tight mb-2">
          {config.cakeTitle || "Make a Wish, Cia 🎂"}
        </h2>
        <p className="text-text-main/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {config.cakeSubtitle ||
            "Pejamkan matamu, buat satu permohonan tulus di dalam hati... lalu tiup lilinnya 🕯️✨"}
        </p>
      </motion.div>

      {/* Birthday Cake Illustration */}
      <div className="relative my-6 select-none flex flex-col items-center">
        {/* Floating candle flame or smoke */}
        <div className="relative h-16 w-8 flex justify-center items-end">
          <AnimatePresence mode="wait">
            {!isBlown ? (
              <motion.div
                key="flame"
                initial={{ scale: 0.8 }}
                animate={{
                  scale: [1, 1.15, 0.95, 1.05, 1],
                  rotate: [-2, 3, -1, 2, -2],
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="w-4 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.9)] cursor-pointer"
                onClick={handleBlowCandle}
                title="Ketuk untuk meniup lilin!"
              />
            ) : (
              <motion.div
                key="smoke"
                initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
                animate={{ opacity: 0, y: -35, scale: 1.4 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-xl text-rose-gold/70"
              >
                💨
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Candle stick */}
        <div className="w-2.5 h-10 bg-gradient-to-b from-rose-200 to-rose-400 rounded-t-sm shadow-sm relative z-10" />

        {/* Cake Tier Top */}
        <div className="relative w-36 sm:w-44 h-12 bg-gradient-to-r from-warm-cream via-[#FFF5EB] to-warm-cream rounded-t-2xl shadow-md border-t-4 border-cherry flex items-center justify-center -mt-1 z-10">
          {/* Frosting drips */}
          <div className="absolute -bottom-1 inset-x-0 flex justify-around px-2 text-soft-pink text-xs">
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
          {/* Strawberries / Cherries on top */}
          <div className="absolute -top-3 inset-x-2 flex justify-between px-2 text-base">
            <span>🍓</span>
            <span>🌸</span>
            <span>🍓</span>
          </div>
        </div>

        {/* Cake Tier Base */}
        <div className="relative w-52 sm:w-60 h-16 bg-gradient-to-r from-[#FCE8EC] via-soft-pink to-[#FCE8EC] rounded-2xl shadow-xl border-b-4 border-rose-gold/40 flex items-center justify-center -mt-1">
          <span className="font-serif text-rose-gold text-xs tracking-widest font-semibold uppercase opacity-75">
            Happy Birthday Cia
          </span>
          <div className="absolute bottom-1 inset-x-4 flex justify-around text-rose-gold/40 text-[10px]">
            <span>✦</span>
            <span>♥</span>
            <span>✦</span>
            <span>♥</span>
            <span>✦</span>
          </div>
        </div>

        {/* Cake Stand / Plate */}
        <div className="w-64 sm:w-72 h-3 bg-white/90 rounded-full shadow-lg border border-rose-gold/20 -mt-1" />
      </div>

      {/* Blow Candle Action Button / Wish Card */}
      <div className="w-full max-w-md mt-4 min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isBlown ? (
            <motion.div
              key="blow-action"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                type="button"
                onClick={handleBlowCandle}
                aria-label={config.cakeBlowButton || "Tiup Lilinnya 💨"}
                className="min-h-12 px-8 py-3.5 rounded-full bg-gradient-to-r from-cherry via-[#d43753] to-rose-gold text-white font-medium text-base sm:text-lg shadow-lg shadow-cherry/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>{config.cakeBlowButton || "Tiup Lilinnya 💨"}</span>
              </button>
              <p className="text-xs text-text-main/50 italic">
                (atau ketuk langsung nyala lilin di atas)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="wish-granted"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full glass rounded-3xl p-6 sm:p-7 shadow-xl border border-rose-gold/30 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-soft-pink via-cherry to-rose-gold" />
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-soft-pink/50 flex items-center justify-center text-cherry">
                <Heart className="w-5 h-5 fill-cherry" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-cherry mb-2">
                {config.cakeWishGrantedTitle}
              </h3>
              <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed mb-5">
                {config.cakeWishGrantedMessage}
              </p>

              <button
                type="button"
                onClick={() => onNext?.()}
                className="w-full sm:w-auto min-h-12 px-8 py-3 rounded-full bg-cherry text-warm-cream font-medium text-sm sm:text-base shadow-md hover:shadow-lg hover:bg-cherry/90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>{config.cakeNextButton || "Lihat Cerita Kita 💖"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
