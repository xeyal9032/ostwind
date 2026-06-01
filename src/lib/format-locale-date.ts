const DATE_LOCALE_MAP: Record<string, string> = {
  az: 'az-AZ',
  tr: 'tr-TR',
  en: 'en-GB',
  ru: 'ru-RU',
  uk: 'uk-UA',
  ge: 'ka-GE',
};

export function formatLocaleDateTime(iso: string, locale: string): string {
  const intlLocale = DATE_LOCALE_MAP[locale] || locale;
  return new Date(iso).toLocaleString(intlLocale);
}
