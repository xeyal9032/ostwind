export const LOCALE_KEYS = ['tr', 'en', 'az', 'ru', 'uk', 'ge'] as const;

export type LocaleKey = (typeof LOCALE_KEYS)[number];

/** Seçilmiş dildən sonra eyni məzmunu göstərmək üçün ehtiyat sırası */
export const LOCALE_FALLBACK_ORDER: readonly LocaleKey[] = [
  'az',
  'tr',
  'en',
  'ru',
  'uk',
  'ge',
];

export const EMPTY_LOCALES: Record<string, string> = {
  tr: '',
  en: '',
  az: '',
  ru: '',
  uk: '',
  ge: '',
};

function parseJsonObject(field: unknown): Record<string, string> {
  if (!field) return {};
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as Record<string, string>;
    } catch {
      return {};
    }
  }
  if (typeof field === 'object' && !Array.isArray(field)) {
    return field as Record<string, string>;
  }
  return {};
}

export function mergeLocaleJson(field: unknown): Record<string, string> {
  return { ...EMPTY_LOCALES, ...sanitizeLocaleJson(field) };
}

/** Yalnız dil açarlarını saxlayır (features_tr və s. çıxarılır) */
export function sanitizeLocaleJson(value: unknown): Record<string, string> {
  const result = { ...EMPTY_LOCALES };
  const raw = parseJsonObject(value);
  for (const key of LOCALE_KEYS) {
    const v = raw[key];
    result[key] = typeof v === 'string' ? v : '';
  }
  return result;
}

export function getLocaleText(field: unknown, locale: string): string {
  const record = sanitizeLocaleJson(field);
  if (record[locale]?.trim()) return record[locale].trim();

  for (const key of LOCALE_FALLBACK_ORDER) {
    if (record[key]?.trim()) return record[key].trim();
  }

  return '';
}

/** DB + standart məzmunu birləşdirir: boş dillər standartdan doldurulur */
export function mergeLocaleRecords(
  primary: unknown,
  fallback: unknown,
): Record<string, string> {
  const a = sanitizeLocaleJson(primary);
  const b = sanitizeLocaleJson(fallback);
  const result = { ...EMPTY_LOCALES };

  for (const key of LOCALE_KEYS) {
    result[key] = a[key]?.trim() ? a[key] : b[key] || '';
  }

  return result;
}
