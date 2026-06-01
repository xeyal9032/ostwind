/** ISO 3166-1 alpha-2 — flagcdn.com bayrak kodları */
export const LOCALE_TO_FLAG_COUNTRY: Record<string, string> = {
  az: 'az',
  tr: 'tr',
  en: 'us',
  ru: 'ru',
  uk: 'ua',
  ge: 'ge',
};

export function getFlagCountryCode(locale: string): string {
  return LOCALE_TO_FLAG_COUNTRY[locale] ?? locale;
}
