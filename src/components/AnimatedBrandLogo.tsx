'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { OSTWIND_LOGO_HEADER } from '@/lib/services-brand';

type AnimatedBrandLogoProps = {
  variant?: 'header' | 'footer';
  priority?: boolean;
  className?: string;
};

/** Yatay OstWind loqosu — giriş və hover animasiyası */
export default function AnimatedBrandLogo({
  variant = 'header',
  priority = false,
  className = '',
}: AnimatedBrandLogoProps) {
  const isHeader = variant === 'header';
  // SSR/client uyumu: təsadüfi istiqamət yalnız brauzerdə seçilir
  const [enterFrom, setEnterFrom] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    setEnterFrom(Math.random() < 0.5 ? 'left' : 'right');
  }, []);

  const enterClass = enterFrom ? `brand-logo-in-${enterFrom}` : '';

  return (
    <Link
      href="/"
      aria-label="OstWind Group"
      className={`${enterClass} group relative inline-block ${
        isHeader ? '' : 'mx-auto flex justify-center'
      } ${className}`}
    >
      <span
        className="pointer-events-none absolute -inset-3 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(166,61,50,0.28),transparent_72%)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <span className="relative block overflow-hidden rounded-sm">
        <Image
          src={OSTWIND_LOGO_HEADER}
          alt="OstWind Group"
          width={220}
          height={56}
          priority={priority}
          className={`brand-logo-img relative z-10 w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:brightness-125 ${
            isHeader
              ? 'h-9 max-w-[168px] object-left sm:h-10 sm:max-w-[190px] dark:brightness-110'
              : 'h-10 max-w-[200px] brightness-110'
          }`}
        />
        <span
          className="pointer-events-none absolute inset-0 z-20 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          aria-hidden
        />
      </span>
    </Link>
  );
}
