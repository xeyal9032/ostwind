'use client';

import { createContext, useContext } from 'react';
import type { SiteContentV2 } from '@/lib/site-content';
import { resolveLocaleText } from '@/lib/site-content';

const SiteContentContext = createContext<SiteContentV2 | null>(null);

export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContentV2;
  children: React.ReactNode;
}) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentV2 {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent SiteContentProvider daxilində istifadə olunmalıdır');
  }
  return ctx;
}

export function useSiteText(
  section: 'header' | 'footer',
  key: string,
  locale: string,
  fallback: string,
): string {
  const content = useSiteContent();
  const map = section === 'header' ? content.header[key] : content.footer[key];
  return resolveLocaleText(map, locale, fallback);
}
