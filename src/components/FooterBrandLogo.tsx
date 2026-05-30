'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { OSTWIND_LOGO_BG } from '@/lib/services-brand';

/** Footer marka loqosu — hover effekti və lightbox */
export default function FooterBrandLogo() {
  const t = useTranslations('Footer');
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('openLogo')}
        className="group relative mx-auto flex h-[112px] w-[112px] items-center justify-center rounded-full border border-[#8b2e22]/35 bg-zinc-800/50 p-1.5 shadow-lg shadow-black/30 shadow-[0_0_28px_rgba(139,46,34,0.12)] transition-all duration-300 ease-out hover:scale-105 hover:border-[#a63d32]/55 hover:shadow-xl hover:shadow-[0_0_36px_rgba(166,61,50,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a63d32]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#a63d32]/18 via-[#8b2e22]/8 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <span
          className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-[#8b2e22]/25 transition-all duration-500 group-hover:rotate-3 group-hover:ring-[#a63d32]/45"
        >
          <Image
            src={OSTWIND_LOGO_BG}
            alt={t('brandLogoAlt')}
            width={160}
            height={160}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t('brandLogoAlt')}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t('closeLogo')}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/90 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a63d32]/50 sm:right-6 sm:top-6"
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>

          <div
            className="relative max-h-[min(90vh,640px)] max-w-[min(92vw,640px)] logo-lightbox-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={OSTWIND_LOGO_BG}
              alt={t('brandLogoAlt')}
              className="h-auto w-full rounded-2xl shadow-2xl shadow-[0_0_48px_rgba(166,61,50,0.22)] ring-1 ring-[#a63d32]/20"
            />
          </div>
        </div>
      )}
    </>
  );
}
