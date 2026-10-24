import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

export default function FloatingHearts() {
  const shouldReduceMotion = useReducedMotion();

  // Generate 16 floating elements with stable positions, sizes, and animation attributes
  const floatingItems = useMemo(() => {
    // Hearts ❤️, petals 🌸, sparkles ✨, and romantic accents 💕
    const symbols = ["❤️", "🌸", "✨", "💕", "🌸", "❤️", "✨", "💖"];
    const sizes = [
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl",
      "text-2xl",
    ];

    // Pre-distributed values ensuring organic look across mobile and desktop
    const count = 16;
    const items = [];

    const leftPositions = [
      5, 12, 22, 31, 40, 49, 58, 67, 75, 84, 92, 8, 28, 52, 71, 89,
    ];
    const topPositions = [
      8, 24, 68, 15, 82, 37, 54, 91, 19, 63, 44, 76, 33, 87, 12, 59,
    ];
    const durations = [
      6.5, 8.0, 7.2, 9.5, 6.8, 10.2, 7.5, 8.8, 6.2, 9.0, 7.8, 11.0, 8.4, 6.9, 9.8, 7.1,
    ];
    const delays = [
      0.2, 1.5, 3.1, 0.8, 2.4, 4.0, 1.1, 3.6, 0.5, 2.9, 4.7, 1.8, 3.3, 0.9, 2.2, 4.2,
    ];
    const opacities = [
      0.18, 0.25, 0.16, 0.28, 0.22, 0.15, 0.27, 0.20, 0.30, 0.17, 0.24, 0.19, 0.26, 0.21, 0.15, 0.29,
    ];

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        symbol: symbols[i % symbols.length],
        size: sizes[i % sizes.length],
        left: `${leftPositions[i]}%`,
        top: `${topPositions[i]}%`,
        duration: `${durations[i]}s`,
        delay: `${delays[i]}s`,
        opacity: opacities[i],
      });
    }

    return items;
  }, []);

  // Respect user preference for reduced motion
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {floatingItems.map((item) => (
        <span
          key={item.id}
          className={`animate-float absolute ${item.size} will-change-transform`}
          style={{
            left: item.left,
            top: item.top,
            opacity: item.opacity,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
