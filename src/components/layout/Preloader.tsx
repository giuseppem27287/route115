import { useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/ui/Logo';
import { useLanguage } from '@/hooks/useLanguage';
import type { TranslationKey } from '@/i18n';

const COPY_KEYS: readonly TranslationKey[] = [
  'preloader.step1',
  'preloader.step2',
  'preloader.step3',
];

/**
 * Boot screen: tachometer needle surging to 100 while the Route 115 crest
 * flickers (Figma Make design). Calls `onDone` when the animation is over.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();
  const [speed, setSpeed] = useState(0);
  const [gone, setGone] = useState(false);

  // Keep the latest callback without restarting the animation on re-render.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      // ease-out so the needle surges then settles
      const eased = 1 - Math.pow(1 - p, 3);
      setSpeed(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setGone(true), 350);
        setTimeout(() => onDoneRef.current(), 950);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const idx = Math.max(0, Math.min(COPY_KEYS.length - 1, Math.floor(speed / 34)));
  const copy = t(COPY_KEYS[idx] ?? COPY_KEYS[COPY_KEYS.length - 1]);

  // Gauge geometry: 240deg sweep from -120deg (bottom-left) to +120deg.
  const angle = -120 + (speed / 100) * 240;
  const R = 88;
  const C = 2 * Math.PI * R;
  const dash = C * (240 / 360);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-coal-950 transition-opacity duration-500 ${
        gone ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="grain absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center">
        <Logo className="mb-10 h-32 sm:h-40" flicker />

        <div className="relative size-56">
          <svg viewBox="0 0 220 220" className="size-full -rotate-90">
            <circle
              cx="110"
              cy="110"
              r={R}
              fill="none"
              className="stroke-coal-700"
              strokeWidth="10"
              strokeDasharray={`${dash} ${C}`}
              strokeLinecap="round"
              transform="rotate(150 110 110)"
            />
            <circle
              cx="110"
              cy="110"
              r={R}
              fill="none"
              className="stroke-ignition-500"
              strokeWidth="10"
              strokeDasharray={`${(dash * speed) / 100} ${C}`}
              strokeLinecap="round"
              transform="rotate(150 110 110)"
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,85,0,0.8))' }}
            />
          </svg>

          {/* Needle + center cap, centered in the gauge */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="h-[74px] w-[3px] bg-rust-500"
              style={{
                transformOrigin: 'bottom center',
                transform: `translateY(-50%) rotate(${angle}deg)`,
                boxShadow: '0 0 10px rgba(226,84,43,0.9)',
              }}
            />
            <div className="absolute size-4 rounded-full bg-rust-500 shadow-[0_0_8px_rgba(226,84,43,0.8)]" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="mt-6 font-display text-5xl text-chalk-50">{speed}</span>
            <span className="font-condensed text-sm uppercase tracking-[0.3em] text-steel-300">
              {t('preloader.unit')}
            </span>
          </div>
        </div>

        <div className="mt-10 font-condensed text-sm uppercase tracking-[0.4em] text-steel-300">
          {copy}
        </div>
      </div>
    </div>
  );
}
