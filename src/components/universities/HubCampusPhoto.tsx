'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  fallbackSrc?: string | null;
  className?: string;
  priority?: boolean;
};

/** Kampus şəkli — səhv URL-də fallback və ya placeholder */
export default function HubCampusPhoto({ src, alt, fallbackSrc, className, priority }: Props) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed && !fallbackSrc) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-800/80 text-white/50 text-sm ${className ?? ''}`}
        aria-hidden
      >
        🎓
      </div>
    );
  }

  const isLocal = current.startsWith('/');

  return (
    <Image
      src={current}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes="(max-width: 640px) 100vw, 320px"
      className={className ?? 'object-cover'}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) {
          setCurrent(fallbackSrc);
          return;
        }
        setFailed(true);
      }}
      unoptimized={!isLocal && current.includes('flagcdn.com')}
    />
  );
}
