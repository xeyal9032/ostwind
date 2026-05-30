'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

/** ISO 3166-1 alpha-2 — flagcdn.com ile gerçek bayrak görselleri */
export const LANGUAGES = [
  { code: 'az', name: 'Azərbaycanca', countryCode: 'az' },
  { code: 'tr', name: 'Türkçe', countryCode: 'tr' },
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'ru', name: 'Русский', countryCode: 'ru' },
  { code: 'uk', name: 'Українська', countryCode: 'ua' },
  { code: 'ge', name: 'ქართული', countryCode: 'ge' },
] as const;

function FlagImage({ countryCode, label }: { countryCode: string; label: string }) {
  return (
    <span className="relative block h-[18px] w-7 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-white/15">
      <Image
        src={`https://flagcdn.com/w80/${countryCode}.png`}
        alt=""
        width={28}
        height={18}
        className="h-full w-full object-cover"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

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
                <FlagImage countryCode={lang.countryCode} label={`${lang.name} bayrağı`} />
                <span>{lang.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
