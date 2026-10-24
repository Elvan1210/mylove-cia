import { useState, useEffect, useRef, useCallback } from "react";
import { Music } from "lucide-react";
import { config } from "../config";

export default function MusicPlayer({ shouldPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const wasPlayingRef = useRef(false);

  // Fade in volume gradually from 0 to target over 1 second (1000ms)
  const fadeInVolume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const targetVolume = typeof config.musicVolume === "number" ? config.musicVolume : 0.5;
    audio.volume = 0;
    const duration = 1000;
    const stepInterval = 50; // update every 50ms (20 steps)
    const stepIncrement = targetVolume / (duration / stepInterval);

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current);
        return;
      }

      const nextVolume = Math.min(targetVolume, audioRef.current.volume + stepIncrement);
      audioRef.current.volume = nextVolume;

      if (nextVolume >= targetVolume) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }, stepInterval);
  }, []);

  // When shouldPlay becomes true, attempt to play (with catch for autoplay failures)
  useEffect(() => {
    const audio = audioRef.current;
    if (!shouldPlay || !audio) return;

    audio.muted = false;
    setIsMuted(false);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          fadeInVolume();
        })
        .catch(() => {
          // Autoplay blocked by browser policy; silently fail until user interaction
          setIsPlaying(false);
        });
    }
  }, [shouldPlay, fadeInVolume]);

  // Handle visibilitychange: pause when hidden, resume when visible (only if was playing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingRef.current = true;
          audio.pause();
        } else {
          wasPlayingRef.current = false;
        }
      } else {
        if (wasPlayingRef.current) {
          wasPlayingRef.current = false;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Silently catch resume errors
            });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Toggle mute/unmute on click (don't stop playback, just mute/unmute)
  const togglePlayOrMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      // If not currently playing (e.g. autoplay was blocked or user clicked before trigger)
      audio.muted = false;
      setIsMuted(false);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            fadeInVolume();
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    } else {
      // Already playing: toggle mute/unmute
      const nextMuted = !audio.muted;
      audio.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  }, [isPlaying, fadeInVolume]);

  const musicSrc = (() => {
    if (!config.musicFile) return "";
    if (config.musicFile.startsWith("http://") || config.musicFile.startsWith("https://")) {
      return config.musicFile;
    }
    const cleanPath = config.musicFile.replace(/^\/+/, "");
    return `${import.meta.env.BASE_URL}${cleanPath}`;
  })();

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (!document.hidden) {
            setIsPlaying(false);
          }
        }}
        onError={() => {
          // If the audio file doesn't exist, silently fail - no crash
          setIsPlaying(false);
        }}
      />

      {/* Floating music control button */}
      <button
        type="button"
        onClick={togglePlayOrMute}
        aria-label={isPlaying && !isMuted ? "Matikan musik" : "Putar musik"}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full glass shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-rose-gold/30 hover:border-rose-gold/60 focus-visible:outline-rose-gold"
      >
        {isPlaying && !isMuted ? (
          <span
            className="text-2xl select-none inline-block animate-spin-slow transition-opacity duration-300"
            role="img"
            aria-hidden="true"
          >
            💿
          </span>
        ) : isPlaying && isMuted ? (
          <span className="relative flex items-center justify-center transition-opacity duration-300">
            <span
              className="text-2xl select-none inline-block opacity-40 transition-opacity duration-300"
              role="img"
              aria-hidden="true"
            >
              💿
            </span>
            <span className="absolute w-6 h-[2px] bg-rose-gold rotate-45 rounded-full" />
          </span>
        ) : (
          <Music className="w-5 h-5 text-rose-gold transition-opacity duration-300" />
        )}
      </button>
    </>
  );
}
