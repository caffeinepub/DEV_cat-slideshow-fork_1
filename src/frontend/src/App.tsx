import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const CAT_IMAGES = [
  "/assets/european-shorthair-8601492_1280-1.jpg",
  "/assets/european-shorthair-8601492_1280-2.jpg",
  "/assets/european-shorthair-8601492_1280-3.jpg",
  "/assets/european-shorthair-8601492_1280-4.jpg",
  "/assets/european-shorthair-8601492_1280-5.jpg",
  "/assets/european-shorthair-8601492_1280-7.jpg",
  "/assets/european-shorthair-8601492_1280-8.jpg",
  "/assets/pexels-wojciech-kumpicki-1084687-2071873-1.jpg",
  "/assets/pexels-wojciech-kumpicki-1084687-2071873-3.jpg",
  "/assets/pexels-pixabay-416195-1.jpg",
  "/assets/pexels-pixabay-45170-1.jpg",
  "/assets/pexels-pixabay-45170-2.jpg",
  "/assets/pexels-cristyanbohn-4012470-1.jpg",
  "/assets/pexels-cristyanbohn-4012470-2.jpg",
  "/assets/pexels-cristyanbohn-4012470-3.jpg",
  "/assets/pexels-catscoming-674570-1.jpg",
  "/assets/pexels-catscoming-674570-2.jpg",
  "/assets/pexels-catscoming-674570-3.jpg",
  "/assets/silver-tabby-cat-sitting-on-green-background-free-photo-3.jpg",
  "/assets/silver-tabby-cat-sitting-on-green-background-free-photo-4.jpg",
  "/assets/download-3.jpeg",
  "/assets/download-4.jpeg",
  "/assets/download-5.jpeg",
];

const AUTOPLAY_INTERVAL = 4000;

export default function App() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = CAT_IMAGES.length;

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => {
    goTo(current - 1, -1);
  }, [current, goTo]);

  const goNext = useCallback(() => {
    goTo(current + 1, 1);
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % total);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [playing, total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  // Auto-hide controls
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60, scale: 1.02 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60, scale: 0.98 }),
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-background"
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* Images */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {CAT_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Cat ${i + 1}`}
              data-ocid={`slideshow.item.${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.5) 100%)",
        }}
      />

      {/* Top gradient + title */}
      <motion.div
        className="absolute top-0 left-0 right-0 px-6 pt-6 pb-16 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)",
        }}
        animate={{ opacity: controlsVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-light tracking-widest text-foreground/80 uppercase select-none">
          Cat Gallery
        </h1>
      </motion.div>

      {/* Controls bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        animate={{
          opacity: controlsVisible ? 1 : 0,
          y: controlsVisible ? 0 : 12,
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Bottom gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.92) 0%, transparent 100%)",
          }}
        />

        {/* Progress bar */}
        <div className="relative px-6 pt-4">
          <div className="flex gap-1">
            {CAT_IMAGES.map((src, i) => (
              <button
                type="button"
                key={src}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className="flex-1 h-0.5 rounded-full transition-all duration-300 hover:scale-y-150"
                style={{
                  backgroundColor:
                    i === current
                      ? "oklch(0.35 0.08 85)"
                      : i < current
                        ? "oklch(0.55 0 0)"
                        : "oklch(0.78 0 0)",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Buttons row */}
        <div className="relative flex items-center justify-between px-6 py-5">
          {/* Counter */}
          <span className="font-body text-sm font-medium tracking-widest text-foreground/50 select-none tabular-nums">
            {String(current + 1).padStart(2, "0")}{" "}
            <span className="text-foreground/30">/</span>{" "}
            {String(total).padStart(2, "0")}
          </span>

          {/* Nav controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="slideshow.prev_button"
              onClick={goPrev}
              aria-label="Previous"
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-foreground/15 bg-white/60 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:border-foreground/30 hover:bg-white/80 transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              data-ocid="slideshow.toggle"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="group flex items-center justify-center w-14 h-14 rounded-full border border-foreground/20 bg-white/70 backdrop-blur-sm text-foreground hover:border-foreground/40 hover:bg-white/90 transition-all duration-200 active:scale-95"
              style={{
                boxShadow: playing
                  ? "0 0 20px 2px oklch(0.35 0.08 85 / 0.15)"
                  : "none",
              }}
            >
              {playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 translate-x-0.5" />
              )}
            </button>

            <button
              type="button"
              data-ocid="slideshow.next_button"
              onClick={goNext}
              aria-label="Next"
              className="group flex items-center justify-center w-11 h-11 rounded-full border border-foreground/15 bg-white/60 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:border-foreground/30 hover:bg-white/80 transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer credit */}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-foreground/40 hover:text-foreground/60 transition-colors select-none"
          >
            Built with ♥ caffeine.ai
          </a>
        </div>
      </motion.div>
    </div>
  );
}
