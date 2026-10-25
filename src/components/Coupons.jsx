import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Ticket, Heart, Check, Send, X, Sparkles } from "lucide-react";
import { config } from "../config";

const STORAGE_KEY = "cia-coupons-claim-counts";
const LIST = config.couponsList || [];
const CATEGORIES = config.couponsCategories || [];

// Baca jumlah klaim tiap kupon dari memori HP (supaya tidak hilang saat refresh)
function loadClaims() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch {
    return {};
  }
}

function saveClaims(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // abaikan jika storage diblokir
  }
}

// Buka WhatsApp dengan pesan klaim kupon
function sendToWhatsApp(coupon) {
  const text =
    `Halo Mine ${"❤️"}\n\n` +
    `Cia mau klaim kupon cinta nih:\n` +
    `${coupon.icon} *${coupon.title}*\n\n` +
    `"${coupon.desc}"\n\n` +
    `Ditagih ya, Mine! Nggak boleh nolak 😚💖`;
  const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;
  const win = window.open(url, "_blank", "noopener");
  if (!win) window.location.href = url; // fallback jika popup diblokir
}

export default function Coupons({ onNext }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [claims, setClaims] = useState(loadClaims);
  const [selected, setSelected] = useState(null); // kupon yang sedang dikonfirmasi

  const list = LIST;
  const categories = CATEGORIES;

  useEffect(() => {
    saveClaims(claims);
  }, [claims]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? list
        : list.filter((c) => c.category === activeCategory),
    [list, activeCategory]
  );

  const countFor = (catId) =>
    catId === "all" ? list.length : list.filter((c) => c.category === catId).length;

  const fireConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.65 },
        colors: ["#F9D5DC", "#B76E79", "#C8102E", "#FFD700", "#FFF8F0"],
      });
    } catch {
      // abaikan
    }
  }, []);

  const handleConfirmClaim = () => {
    if (!selected) return;
    const coupon = selected;
    setClaims((prev) => ({
      ...prev,
      [coupon.id]: (prev[coupon.id] || 0) + 1,
    }));
    fireConfetti();
    sendToWhatsApp(coupon);
    setSelected(null);
  };

  const totalClaims = Object.values(claims).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-soft-pink/50 text-cherry text-xs font-medium mb-3 border border-rose-gold/20">
          <Ticket className="w-3.5 h-3.5" />
          <span>Love Coupon Book</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-text-main tracking-tight mb-2">
          {config.couponsTitle}
        </h2>
        <p className="text-text-main/70 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {config.couponsSubtitle}
        </p>
        <p className="text-rose-gold text-xs italic mt-2 max-w-sm mx-auto">
          {config.couponsTopNote}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs sm:text-sm text-text-main font-medium">
          <Heart className="w-4 h-4 fill-cherry text-cherry" />
          <span>
            Total {totalClaims}x kupon sudah diklaim · bisa dipakai berkali-kali 💕
          </span>
        </div>
      </motion.div>

      {/* Category tabs */}
      <div className="w-full overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        <div className="flex gap-2 w-max mx-auto">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-10 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap border transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-cherry text-warm-cream border-cherry shadow-md shadow-cherry/20"
                    : "glass text-text-main hover:bg-white/80"
                }`}
              >
                {cat.id === "all" ? `Semua (${countFor("all")})` : cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Coupon list */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((coupon, index) => {
            const claimCount = claims[coupon.id] || 0;
            const isMaster = coupon.badge === "MASTER COUPON";
            return (
              <motion.div
                key={coupon.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
                className={`relative rounded-2xl p-4 flex flex-col border-2 border-dashed ${
                  isMaster
                    ? "bg-gradient-to-br from-amber-50 to-soft-pink/60 border-amber-400/70 shadow-md"
                    : "bg-white/90 border-rose-gold/40 shadow-sm"
                }`}
              >
                {/* Lubang tiket kiri-kanan */}
                <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blush" />
                <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blush" />

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {coupon.icon}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      isMaster
                        ? "bg-amber-400/90 text-white"
                        : "bg-soft-pink/60 text-rose-gold"
                    }`}
                  >
                    {coupon.badge}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-text-main mb-1 leading-snug">
                  {coupon.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-main/75 leading-relaxed mb-4 flex-1">
                  {coupon.desc}
                </p>

                {claimCount > 0 && (
                  <div className="flex items-center justify-center gap-1 text-xs text-emerald-700 font-medium mb-2">
                    <Check className="w-3.5 h-3.5" />
                    <span>Sudah diklaim {claimCount}x</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setSelected(coupon)}
                  className="min-h-11 rounded-full bg-cherry text-warm-cream text-sm font-medium shadow-md shadow-cherry/20 hover:bg-cherry/90 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{claimCount > 0 ? "Klaim Lagi" : "Klaim Kupon"}</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Next button */}
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
          <span>{config.couponsNextButton || "Lihat Cerita Kita 💖"}</span>
        </button>
        <p className="text-xs text-text-main/50 mt-3">
          Semua kupon bisa diklaim berkali-kali, kapanpun kamu mau ✨
        </p>
      </motion.div>

      {/* Confirm modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-text-main/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-warm-cream p-6 text-center shadow-2xl border border-rose-gold/30"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Tutup"
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-text-main/50 hover:bg-soft-pink/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-5xl mb-2">{selected.icon}</div>
              <div className="inline-flex items-center gap-1 text-xs text-rose-gold font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selected.badge}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-text-main mb-2">
                {selected.title}
              </h3>
              <p className="text-sm text-text-main/75 leading-relaxed mb-5">
                {selected.desc}
              </p>
              <p className="text-xs text-text-main/60 mb-4">
                Klaim sekarang? WhatsApp akan terbuka dan pesannya langsung siap dikirim ke {config.nicknameMine || "Mine"} 💌
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 min-h-12 rounded-full glass text-text-main font-medium text-sm cursor-pointer hover:bg-white/80 active:scale-95 transition"
                >
                  Nanti dulu
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClaim}
                  className="flex-1 min-h-12 rounded-full bg-cherry text-warm-cream font-medium text-sm shadow-md shadow-cherry/25 cursor-pointer hover:bg-cherry/90 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Klaim & Kirim</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}