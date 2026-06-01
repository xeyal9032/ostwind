'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LocaleFlag from '@/components/LocaleFlag';

export const LANGUAGES = [
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ge', name: 'ქართული' },
] as const;

type LanguageSwitcherProps = {
  title: string;
  className?: string;
};

export default function LanguageSwitcher({ title, className = '' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ul className="space-y-2">
        {LANGUAGES.map((lang) => {
          const isActive = locale === lang.code;
          return (
            <li key={lang.code}>
              <Link
                href={pathname}
                locale={lang.code}
                className={`inline-flex items-center gap-3 text-sm transition-colors rounded-md px-2 py-1.5 -ml-2 ${
                  isActive
                    ? 'text-white bg-zinc-800 font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <LocaleFlag locale={lang.code} label={`${lang.name} bayrağı`} size="md" />
                <span>{lang.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
