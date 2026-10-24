import { motion } from "framer-motion";
import { Heart, Sparkles, Gift } from "lucide-react";
import { config } from "../config";

export default function Intro(props) {
  const handleClick = () => {
    if (typeof props?.onComplete === "function") {
      props.onComplete();
    }
  };

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-warm-cream via-blush/30 to-blush px-4 py-8">
      {/* Decorative ambient blurred backdrops */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-soft-pink/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-rose-gold/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Main card with subtle entrance animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative z-10 mx-auto flex w-full max-w-md flex-col items-center rounded-3xl p-8 text-center shadow-xl shadow-rose-gold/10 sm:p-10"
      >
        {/* Decorative gift badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="relative mb-6 flex h-18 w-18 items-center justify-center rounded-full bg-soft-pink/60 text-cherry shadow-inner ring-4 ring-rose-gold/20"
        >
          <Gift className="h-9 w-9 text-cherry" />
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-1 -right-1 text-rose-gold"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
        </motion.div>

        {/* Text container with decorative hearts and sparkles around it */}
        <div className="relative mb-8 px-4">
          {/* Small floating sparkles and hearts around title */}
          <motion.span
            animate={{ y: [0, -5, 0], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-4 -left-2 text-rose-gold select-none"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5" />
          </motion.span>

          <motion.span
            animate={{ y: [0, -6, 0], scale: [1, 1.15, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="pointer-events-none absolute -top-5 -right-2 text-cherry select-none"
            aria-hidden="true"
          >
            <Heart className="h-5 w-5 fill-cherry/30" />
          </motion.span>

          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="pointer-events-none absolute -bottom-3 -right-3 hidden text-rose-gold sm:inline-block select-none"
            aria-hidden="true"
          >
            <Sparkles className="h-4 w-4" />
          </motion.span>

          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="pointer-events-none absolute -bottom-3 -left-3 hidden text-rose-gold/80 sm:inline-block select-none"
            aria-hidden="true"
          >
            <Heart className="h-4 w-4 fill-rose-gold/30" />
          </motion.span>

          <h1 className="font-serif text-2xl font-bold leading-relaxed tracking-tight text-text-main sm:text-3xl md:text-4xl">
            {config.introTitle}
          </h1>
        </div>

        {/* Action button with gentle pulse animation and min-h-[48px] */}
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={config.introButton || "Buka Hadiah"}
          animate={{
            scale: [1, 1.035, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-cherry via-[#d43753] to-rose-gold px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-cherry/25 transition-all duration-300 hover:shadow-xl hover:shadow-cherry/35 focus-visible:outline-rose-gold cursor-pointer"
        >
          <Gift className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          <span>{config.introButton}</span>
          <Sparkles className="h-4 w-4 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.button>
      </motion.div>
    </main>
  );
}
