// src/components/IconCarousel.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { techIcons as BASE } from "../data/techIcons";

const REPEATS = 3;   // duplicamos/triplicamos para loop
const GAP_PX  = 24;  // gap-6

export default function IconCarousel({
  pxPerSec = 70,           // auto-scroll suave (px por segundo)
  stepItems = 1,           // tarjetas por click
  clickMs = 1000,           // duración del click (ms)
  clickEasing = "cubic-bezier(.22,.61,.36,1)",
}) {
  const trackRef = useRef(null);
  const firstItemRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () => Array.from({ length: REPEATS }, () => BASE).flat(),
    [BASE]
  );

  // medidas
  const itemW = () =>
    firstItemRef.current?.getBoundingClientRect().width || 112;
  const sectionW = () => (itemW() + GAP_PX) * BASE.length;

  // desplazamiento
  const offset = useRef(0);
  const rafId  = useRef(0);
  const lastTs = useRef(0);

  const setX = (x, withTransition = false) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = withTransition
      ? `transform ${clickMs}ms ${clickEasing}`
      : "none";
    el.style.transform = `translateX(${-x}px)`;
  };

  // colocar al centro al iniciar
  useEffect(() => {
    const mid = sectionW();
    offset.current = mid;
    setX(mid, false);
    lastTs.current = performance.now();
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BASE]);

  // loop suave con RAF
  const tick = (ts) => {
    const dt = Math.min(100, ts - lastTs.current);
    lastTs.current = ts;

    if (!paused) {
      offset.current += (pxPerSec * dt) / 1000;
      setX(offset.current, false);
      normalize();
    }
    rafId.current = requestAnimationFrame(tick);
  };

  // normalización (loop perfecto)
  const normalize = () => {
    const sec = sectionW();
    if (offset.current >= sec * 2) {
      offset.current -= sec;
      setX(offset.current, false);
    } else if (offset.current < sec) {
      offset.current += sec;
      setX(offset.current, false);
    }
  };

  // botones prev/next (misma suavidad)
  const slide = (dir = 1, n = stepItems) => {
    const step = (itemW() + GAP_PX) * n;
    offset.current += dir * step;
    setX(offset.current, true);
    setTimeout(normalize, clickMs + 30);
  };

  // recalc on resize
  useEffect(() => {
    const onResize = () => {
      const mid = sectionW();
      offset.current = mid;
      setX(mid, false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BASE]);

  if (!BASE?.length) return null;

  return (
    <div
      className="relative w-full max-w-[680px] mx-auto overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-6 will-change-transform">
          {items.map(({ Icon, label, cls }, i) => (
            <div
              key={`${label}-${i}`}
              ref={i === 0 ? firstItemRef : null}
              className="shrink-0 w-28 text-center"
            >
              <Icon className={`text-5xl mx-auto ${cls}`} />
              <p className="text-sm mt-2">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <button
        type="button"
        onClick={() => slide(-1, 2)}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur px-2 py-1 shadow hover:scale-105"
        aria-label="Anterior"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => slide(1, 2)}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur px-2 py-1 shadow hover:scale-105"
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>
  );
}
