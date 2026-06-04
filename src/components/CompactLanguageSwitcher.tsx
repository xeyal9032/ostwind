'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LocaleFlag from '@/components/LocaleFlag';
import { LANGUAGES } from '@/components/LanguageSwitcher';

/** Header mobil menü və digər dar sahələr üçün dil seçici */
export default function CompactLanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {LANGUAGES.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <Link
            key={lang.code}
            href={pathname}
            locale={lang.code}
            className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-primary text-white font-medium shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700'
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={lang.name}
          >
            <LocaleFlag locale={lang.code} label={lang.name} size="sm" />
            <span className="truncate">{lang.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
