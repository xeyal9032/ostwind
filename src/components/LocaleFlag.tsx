'use client';

import Image from 'next/image';
import { getFlagCountryCode } from '@/lib/locale-flags';

type LocaleFlagProps = {
  locale: string;
  /** Ekran oxuyucu / tooltip */
  label: string;
  className?: string;
  size?: 'sm' | 'md';
};

const SIZES = {
  sm: { w: 24, h: 16, className: 'h-4 w-6' },
  md: { w: 28, h: 18, className: 'h-[18px] w-7' },
} as const;

export default function LocaleFlag({ locale, label, className = '', size = 'sm' }: LocaleFlagProps) {
  const countryCode = getFlagCountryCode(locale);
  const dim = SIZES[size];

  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10 dark:ring-white/15 ${dim.className} ${className}`}
    >
      <Image
        src={`https://flagcdn.com/w80/${countryCode}.png`}
        alt=""
        width={dim.w}
        height={dim.h}
        className="h-full w-full object-cover"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
