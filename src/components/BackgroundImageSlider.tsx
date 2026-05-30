'use client';

import { useEffect, useState } from 'react';
import { HERO_SLIDE_INTERVAL_MS } from '@/lib/hero-slides';

type BackgroundImageSliderProps = {
  slides: readonly string[];
  intervalMs?: number;
};

export default function BackgroundImageSlider({
  slides,
  intervalMs = HERO_SLIDE_INTERVAL_MS,
}: BackgroundImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden" aria-hidden>
      {slides.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-zinc-950/85" />
    </div>
  );
}
