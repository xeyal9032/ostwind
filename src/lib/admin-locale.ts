/** Admin panel dilləri (sayt ilə eyni) */
export const ADMIN_LOCALES = ['az', 'tr', 'en', 'ru', 'uk', 'ge'] as const;

export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export const ADMIN_LOCALE_COOKIE = 'ADMIN_LOCALE';

export const DEFAULT_ADMIN_LOCALE: AdminLocale = 'az';

export function isAdminLocale(value: string | undefined): value is AdminLocale {
  return !!value && (ADMIN_LOCALES as readonly string[]).includes(value);
}

export function resolveAdminLocale(cookieValue: string | undefined): AdminLocale {
  return isAdminLocale(cookieValue) ? cookieValue : DEFAULT_ADMIN_LOCALE;
}
