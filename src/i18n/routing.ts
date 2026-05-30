import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['az', 'en', 'tr', 'uk', 'ru', 'ge'],
  defaultLocale: 'az',
  // İlk ziyarət həmişə az; brauzer dili avtomatik seçilmir
  localeDetection: false,
  localePrefix: 'as-needed',
});
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
