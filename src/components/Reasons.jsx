import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, CheckCircle2 } from "lucide-react";
import { config } from "../config";

export default function Reasons({ onNext }) {
  const [openedCards, setOpenedCards] = useState(new Set());

  const toggleCard = (id) => {
    setOpenedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const list = config.reasonsList || [];
  const openedCount = openedCards.size;
  const allOpened = openedCount === list.length && list.length > 0;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-soft-pink/50 text-cherry text-xs font-medium mb-3 border border-rose-gold/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Little Secrets of My Heart</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-text-main tracking-tight mb-2">
          {config.reasonsTitle}
        </h2>
        <p className="text-text-main/70 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {config.reasonsSubtitle}
        </p>

        {/* Progress Counter */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-rose-gold/20 text-xs sm:text-sm text-text-main font-medium">
          <Heart className="w-4 h-4 fill-cherry text-cherry" />
          <span>
            {openedCount} dari {list.length} alasan terungkap
          </span>
          {allOpened && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />
          )}
        </div>
      </motion.div>

      {/* Grid of Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 my-2">
        {list.map((reason, index) => {
          const isOpen = openedCards.has(reason.id);

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => toggleCard(reason.id)}
              className={`rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 relative select-none border ${
                isOpen
                  ? "bg-white/95 shadow-md border-rose-gold/40 ring-2 ring-soft-pink/60"
                  : "glass hover:bg-white/80 shadow-sm border-rose-gold/20 hover:scale-[1.02]"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" role="img" aria-label="emoji">
                    {reason.emoji}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
                    Alasan #{index + 1}
                  </span>
                </div>
                <span className="text-xs text-text-main/40 font-medium">
                  {isOpen ? "Tutup ▲" : "Buka ▼"}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif font-bold text-base sm:text-lg text-text-main mb-1">
                {reason.title}
              </h3>

              {/* Content Body with AnimatePresence */}
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-2 text-xs sm:text-sm text-text-main/80 leading-relaxed border-t border-rose-gold/15 mt-2">
                      {reason.text}
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-xs text-text-main/50 italic mt-1">
                    Ketuk untuk membaca rahasia ini... 💌
                  </p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <button
          type="button"
          onClick={() => onNext?.()}
          className="min-h-12 px-8 py-3.5 rounded-full bg-cherry text-warm-cream font-medium text-base shadow-lg shadow-cherry/25 hover:shadow-xl hover:bg-cherry/90 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mx-auto"
        >
          <span>{config.reasonsNextButton || "Buka Galeri Foto 📸"}</span>
        </button>
      </motion.div>
    </div>
  );
}
