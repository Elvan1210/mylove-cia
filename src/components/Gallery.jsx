import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { config, defaultCaptions } from "../config";

// Auto-detect photos & thumbnails using Vite's eager glob import
const photoModules = import.meta.glob("../assets/photos/foto-*.jpg", {
  eager: true,
});
const thumbModules = import.meta.glob("../assets/photos/thumbs/foto-*.jpg", {
  eager: true,
});

// Deterministic slight rotation for Polaroid aesthetic (-3deg to 3deg)
const ROTATION_ANGLES = [-2.2, 1.8, -1.4, 2.5, -2.7, 1.5, -1.9, 2.2];

function getRotation(index) {
  return ROTATION_ANGLES[index % ROTATION_ANGLES.length];
}

export default function Gallery({ onNext }) {
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Convert glob modules to a sorted array of { src, thumb, filename }
  const photos = useMemo(() => {
    const thumbMap = {};
    for (const [filePath, mod] of Object.entries(thumbModules)) {
      const filename = filePath.split("/").pop() || "";
      if (filename) {
        thumbMap[filename] =
          typeof mod === "object" && mod !== null && "default" in mod
            ? mod.default
            : mod;
      }
    }

    const items = Object.entries(photoModules).map(([filePath, mod]) => {
      const filename = filePath.split("/").pop() || "";
      const src =
        typeof mod === "object" && mod !== null && "default" in mod
          ? mod.default
          : mod;
      const thumb = thumbMap[filename] || src;
      return { src, thumb, filename };
    });

    items.sort((a, b) =>
      a.filename.localeCompare(b.filename, undefined, { numeric: true })
    );

    return items;
  }, []);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: photos.length > 1,
    align: "center",
    skipSnaps: false,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const syncState = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    // Sync on next tick after embla is initialized
    const rafId = requestAnimationFrame(syncState);
    emblaApi.on("select", syncState);
    emblaApi.on("reInit", syncState);

    return () => {
      cancelAnimationFrame(rafId);
      emblaApi.off("select", syncState);
      emblaApi.off("reInit", syncState);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Close lightbox with Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxPhoto(null);
      }
    };

    if (lightboxPhoto) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxPhoto]);

  // Resolve photo caption from config or default fallback
  const getCaption = useCallback((filename, index) => {
    if (config.photoCaptions && config.photoCaptions[filename]) {
      return config.photoCaptions[filename];
    }
    if (Array.isArray(defaultCaptions) && defaultCaptions.length > 0) {
      return defaultCaptions[index % defaultCaptions.length];
    }
    return "";
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full min-h-[100dvh] flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Header */}
      <div className="text-center pt-2 sm:pt-4 mb-4 sm:mb-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-text-main font-bold tracking-tight mb-2">
          {config.galleryTitle || "Perjalanan Kita"}
        </h2>
        {config.gallerySubtitle && (
          <p className="text-text-main/70 text-sm sm:text-base font-sans max-w-md mx-auto px-4">
            {config.gallerySubtitle}
          </p>
        )}
      </div>

      {/* Main Content: Carousel or Empty Placeholder */}
      <div className="my-auto w-full">
        {photos.length === 0 ? (
          <div className="w-full max-w-md mx-auto my-8 p-8 rounded-3xl bg-gradient-to-b from-white/95 to-blush/60 border border-soft-pink shadow-lg text-center backdrop-blur-sm">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-soft-pink/40 flex items-center justify-center text-cherry shadow-inner">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C13.5 4 14.5 6 14.5 7.5C14.5 9 13.5 10 12 10C10.5 10 9.5 9 9.5 7.5C9.5 6 10.5 4 12 2M12 22C10.5 20 9.5 18 9.5 16.5C9.5 15 10.5 14 12 14C13.5 14 14.5 15 14.5 16.5C14.5 18 13.5 20 12 22M2 12C4 10.5 6 9.5 7.5 9.5C9 9.5 10 10.5 10 12C10 13.5 9 14.5 7.5 14.5C6 14.5 4 13.5 2 12M22 12C20 13.5 18 14.5 16.5 14.5C15 14.5 14 13.5 14 12C14 10.5 15 9.5 16.5 9.5C18 9.5 20 10.5 22 12M6.34 6.34C8.11 7.22 9.17 8.28 9.17 9.87C9.17 11.46 8.11 12.52 6.34 13.4C4.57 12.52 3.51 11.46 3.51 9.87C3.51 8.28 4.57 7.22 6.34 6.34M17.66 17.66C15.89 16.78 14.83 15.72 14.83 14.13C14.83 12.54 15.89 11.48 17.66 10.6C19.43 11.48 20.49 12.54 20.49 14.13C20.49 15.72 19.43 16.78 17.66 17.66Z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-text-main font-semibold mb-2">
              Foto-foto kita akan tampil di sini 📸
            </h3>
            <p className="text-text-main/70 text-sm font-sans mb-4">
              Belum ada foto yang dimuat. Momen manis kita berdua akan tersimpan
              rapi di sini.
            </p>
            <div className="flex justify-center text-2xl gap-3 opacity-90 select-none">
              <span>🌸</span>
              <span>✨</span>
              <span>🌷</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-lg mx-auto">
            {/* Desktop Previous Button */}
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Foto sebelumnya"
              className="hidden sm:flex absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2 z-10 w-12 h-12 min-h-12 min-w-12 rounded-full bg-white/95 hover:bg-white text-text-main shadow-md hover:shadow-lg items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-text-main" />
            </button>

            {/* Carousel Viewport */}
            <div className="overflow-hidden py-4 px-1" ref={emblaRef}>
              <div className="flex touch-pan-y items-center">
                {photos.map((photo, index) => {
                  const caption = getCaption(photo.filename, index);
                  const rotation = getRotation(index);

                  return (
                    <div
                      key={photo.filename || index}
                      className="flex-[0_0_82%] sm:flex-[0_0_75%] min-w-0 px-3 select-none"
                    >
                      <div
                        style={{ transform: `rotate(${rotation}deg)` }}
                        onClick={() =>
                          setLightboxPhoto({
                            src: photo.src,
                            caption,
                            filename: photo.filename,
                          })
                        }
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-3 sm:p-4 pb-5 sm:pb-6 cursor-pointer border border-warm-cream/80 group"
                      >
                        {/* Photo Container */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-blush/20">
                          <img
                            src={photo.thumb}
                            alt={caption || `Foto kenangan ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            style={{ objectPosition: "center 30%" }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Polaroid Caption */}
                        <div className="pt-3 sm:pt-4 px-2 text-center min-h-[3.75rem] flex items-center justify-center">
                          <p className="font-script text-xl sm:text-2xl text-rose-gold italic leading-snug line-clamp-2">
                            {caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Next Button */}
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Foto selanjutnya"
              className="hidden sm:flex absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 z-10 w-12 h-12 min-h-12 min-w-12 rounded-full bg-white/95 hover:bg-white text-text-main shadow-md hover:shadow-lg items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-text-main" />
            </button>

            {/* Dot Indicators */}
            {scrollSnaps.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 mb-4">
                {scrollSnaps.map((_, index) => {
                  const isActive = index === selectedIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => scrollTo(index)}
                      aria-label={`Buka foto ke-${index + 1}`}
                      aria-current={isActive ? "true" : "false"}
                      className="p-2 min-h-12 min-w-[28px] flex items-center justify-center focus:outline-none cursor-pointer group"
                    >
                      <span
                        className={`block rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-cherry w-7 h-2.5 shadow-sm"
                            : "bg-soft-pink group-hover:bg-rose-gold/60 w-2.5 h-2.5"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Button */}
      <div className="text-center mt-4 sm:mt-6 pb-4 sm:pb-6">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNext && onNext()}
          className="min-h-12 px-8 py-3.5 rounded-full bg-cherry text-white font-sans font-medium text-base sm:text-lg shadow-md hover:shadow-lg hover:bg-cherry/90 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <span>{config.galleryNextButton || "Lanjut 💌"}</span>
        </motion.button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            key="lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Tutup foto"
              className="absolute top-4 right-4 z-20 w-12 h-12 min-h-12 min-w-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-lg focus:outline-none cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.caption || lightboxPhoto.filename}
                className="max-w-[90vw] max-h-[75vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border-2 border-white/20 select-none"
              />
              {lightboxPhoto.caption && (
                <p className="mt-3 text-center text-white font-script text-xl sm:text-2xl italic px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-sm max-w-lg shadow-md">
                  {lightboxPhoto.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
