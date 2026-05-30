'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/** Mezuniyet kepçesi — aşağı kaydırınca yukarı çık */
export default function GraduationScrollTop() {
  const t = useTranslations('ScrollTop');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('label')}
      title={t('label')}
      className={`group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-primary/95 text-white shadow-lg shadow-black/25 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-110 hover:border-accent hover:shadow-xl hover:shadow-accent/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-zinc-900/95 dark:shadow-black/50 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <svg
        viewBox="0 0 64 64"
        className={`relative h-9 w-9 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-10 sm:w-10 ${visible ? 'scroll-top-float' : ''}`}
        aria-hidden
      >
        {/* Kep tabanı */}
        <path
          d="M8 38c0-2 4-4 24-4s24 2 24 4v4H8v-4z"
          fill="currentColor"
          className="text-white/90"
        />
        <ellipse cx="32" cy="38" rx="24" ry="5" fill="currentColor" className="text-zinc-300/80" />

        {/* Kep tahtası (mortarboard) */}
        <g className="origin-[32px_28px] transition-transform duration-500 group-hover:rotate-[-6deg]">
          <path
            d="M32 12 4 26l28 14 28-14L32 12z"
            fill="var(--color-accent, #cda252)"
          />
          <path
            d="M32 12v14M4 26l28 14 28-14"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.8"
            fill="none"
          />
        </g>

        {/* Püskül */}
        <g className="origin-[48px_22px] transition-transform duration-500 group-hover:rotate-[12deg]">
          <line x1="48" y1="22" x2="48" y2="34" stroke="var(--color-accent, #cda252)" strokeWidth="1.5" />
          <circle cx="48" cy="35" r="2.5" fill="var(--color-accent, #cda252)" />
          <path
            d="M48 35c-2 2-4 5-3 8 1-2 3-4 3-8z"
            fill="var(--color-accent, #cda252)"
            opacity="0.85"
          />
        </g>

        {/* Yukarı ok — kep altında */}
        <path
          d="M32 44v8M28 48l4-4 4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        />
      </svg>
    </button>
  );
}
