'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { OSTWIND_LOGO_ROUND } from '@/lib/services-brand';

type AdminBrandLogoProps = {
  href?: string;
  size?: number;
  className?: string;
};

/** Admin sidebar — dairəvi OstWind loqosu */
export default function AdminBrandLogo({
  href = '/admin/dashboard',
  size = 56,
  className = '',
}: AdminBrandLogoProps) {
  const t = useTranslations('layout');

  const image = (
    <Image
      src={OSTWIND_LOGO_ROUND}
      alt={t('brandLogoAlt')}
      width={size}
      height={size}
      className={`rounded-full object-cover ring-2 ring-white/10 shadow-md ${className}`}
      priority
    />
  );

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      aria-label={t('brandLogoAlt')}
    >
      {image}
    </Link>
  );
}
