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
    <div className="hero-bg-slider pointer-events-none absolute inset-0 z-0 size-full overflow-hidden bg-zinc-950" aria-hidden>
      {slides.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`hero-bg-slide absolute inset-0 size-full transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Mobil: boş sahələri doldurmaq üçün bulanıq arxa plan */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="hero-bg-img-blur"
            decoding="async"
            loading="lazy"
            aria-hidden
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="hero-bg-img"
            decoding="async"
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/15 md:bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-zinc-950/90 max-md:from-black/50 max-md:via-black/35" />
    </div>
  );
}
