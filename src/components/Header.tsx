'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import AnimatedBrandLogo from '@/components/AnimatedBrandLogo';
import StudentAuthLinks from '@/components/StudentAuthLinks';
import CompactLanguageSwitcher from '@/components/CompactLanguageSwitcher';
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

/** Header hündürlüyü — mobil menü bu xəttdən aşağı açılır */
const MOBILE_HEADER_TOP =
  'top-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:top-[calc(4rem+env(safe-area-inset-top,0px))]';

export default function Header() {
  const t = useTranslations('Header');
  const tFooter = useTranslations('Footer');
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
  const languageLabel = tFooter('language');

  const navItems = NAV_KEYS.map((item) => ({
    name: navLabels[item.key],
    href: item.href,
  }));

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* backdrop-blur yalnız toolbar-da — fixed menunu kəsməsin */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)]">
        <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm border-b border-gray-200/60 dark:border-zinc-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-[auto_1fr_auto] items-center h-14 sm:h-16 w-full gap-x-2 lg:gap-x-4">
              <div className="flex shrink-0 items-center -ml-1 sm:-ml-3 lg:-ml-4 py-1 pr-1">
                <AnimatedBrandLogo variant="header" priority />
              </div>

              <nav className="hidden lg:flex justify-center items-center gap-x-2 xl:gap-x-4 min-w-0 px-1">
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

              <div className="hidden lg:flex items-center justify-end gap-2 shrink-0">
                <Link
                  href="/apply"
                  className="inline-flex min-h-[44px] items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors whitespace-nowrap"
                >
                  {applyNowLabel}
                </Link>
                <StudentAuthLinks />
              </div>

              <div className="flex lg:hidden col-start-3 justify-self-end">
                {isMenuOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    aria-expanded="true"
                    aria-controls="mobile-nav"
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                  >
                    <span className="sr-only">Menünü bağla</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    aria-expanded="false"
                    aria-controls="mobile-nav"
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                  >
                    <span className="sr-only">Menünü aç</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil menü — header xaricində (viewport fixed) */}
      {isMenuOpen ? (
        <div
          id="mobile-nav"
          className={`lg:hidden fixed inset-x-0 bottom-0 ${MOBILE_HEADER_TOP} z-40 flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobil menü"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Menünü bağla"
            onClick={closeMenu}
          />
          <nav className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain bg-white dark:bg-zinc-900 shadow-2xl border-t border-gray-200 dark:border-zinc-700">
            <div className="px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-3 pb-2 border-t border-gray-200 dark:border-zinc-700 mt-2">
                <Link
                  href="/apply"
                  className="flex min-h-[48px] w-full items-center justify-center rounded-xl text-base font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm"
                  onClick={closeMenu}
                >
                  {applyNowLabel}
                </Link>
              </div>

              <div className="px-1 py-3 flex justify-center">
                <StudentAuthLinks />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">
                  {languageLabel}
                </p>
                <CompactLanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
