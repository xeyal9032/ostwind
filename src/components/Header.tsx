'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import AnimatedBrandLogo from '@/components/AnimatedBrandLogo';
import StudentAuthLinks from '@/components/StudentAuthLinks';
import { useSiteText } from '@/components/SiteContentProvider';

const NAV_KEYS = [
  { key: 'home', href: '/' },
  { key: 'universities', href: '/universities' },
  { key: 'services', href: '/services' },
  { key: 'pricing', href: '/pricing' },
  { key: 'faq', href: '/faq' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLabels = {
    home: useSiteText('header', 'home', locale, t('home')),
    universities: useSiteText('header', 'universities', locale, t('universities')),
    services: useSiteText('header', 'services', locale, t('services')),
    pricing: useSiteText('header', 'pricing', locale, t('pricing')),
    faq: useSiteText('header', 'faq', locale, t('faq')),
    blog: useSiteText('header', 'blog', locale, t('blog')),
    about: useSiteText('header', 'about', locale, t('about')),
    contact: useSiteText('header', 'contact', locale, t('contact')),
  };

  const applyNowLabel = useSiteText('header', 'applyNow', locale, t('applyNow'));

  const navItems = NAV_KEYS.map((item) => ({
    name: navLabels[item.key],
    href: item.href,
  }));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 w-full gap-x-2 lg:gap-x-4">
          <div className="flex shrink-0 items-center -ml-2 sm:-ml-3 lg:-ml-4 py-1 pr-1">
            <AnimatedBrandLogo variant="header" priority />
          </div>

          <nav className="hidden md:flex justify-center items-center gap-x-3 lg:gap-x-5 min-w-0 px-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white px-1.5 py-2 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center justify-end gap-2 shrink-0">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-3.5 py-1.5 border border-transparent text-xs sm:text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors whitespace-nowrap"
            >
              {applyNowLabel}
            </Link>
            <StudentAuthLinks />
          </div>

          <div className="flex md:hidden col-start-3 justify-self-end">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <span className="sr-only">Menüyü aç</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/apply"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {applyNowLabel}
            </Link>
            <div className="px-3 py-2">
              <StudentAuthLinks />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
