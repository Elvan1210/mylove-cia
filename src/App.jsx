import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Intro from "./components/Intro";
import LoveMeter from "./components/LoveMeter";
import Gallery from "./components/Gallery";
import Letter from "./components/Letter";
import Closing from "./components/Closing";
import MusicPlayer from "./components/MusicPlayer";
import FloatingHearts from "./components/FloatingHearts";

const pages = ["intro", "lovemeter", "gallery", "letter", "closing"];

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -30 },
};

const pageTransition = {
  type: "tween",
  duration: 0.5,
  ease: "easeInOut",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("intro");
  const [musicStarted, setMusicStarted] = useState(false);

  const goTo = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  }, []);

  const startMusic = useCallback(() => {
    setMusicStarted(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    startMusic();
    goTo("lovemeter");
  }, [startMusic, goTo]);

  const renderPage = () => {
    switch (currentPage) {
      case "intro":
        return (
          <motion.div
            key="intro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[100dvh] flex items-center justify-center"
          >
            <Intro onComplete={handleIntroComplete} />
          </motion.div>
        );
      case "lovemeter":
        return (
          <motion.div
            key="lovemeter"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[100dvh] flex items-center justify-center"
          >
            <LoveMeter onNext={() => goTo("gallery")} />
          </motion.div>
        );
      case "gallery":
        return (
          <motion.div
            key="gallery"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[100dvh]"
          >
            <Gallery onNext={() => goTo("letter")} />
          </motion.div>
        );
      case "letter":
        return (
          <motion.div
            key="letter"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[100dvh] flex items-center justify-center"
          >
            <Letter onNext={() => goTo("closing")} />
          </motion.div>
        );
      case "closing":
        return (
          <motion.div
            key="closing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[100dvh] flex items-center justify-center"
          >
            <Closing onReplay={() => goTo("intro")} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {currentPage !== "intro" && <FloatingHearts />}
      <MusicPlayer shouldPlay={musicStarted} />
      <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
    </div>
  );
}
