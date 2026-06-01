import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { routing } from './routing';
import { resolveAdminLocale } from '@/lib/admin-locale';

export default getRequestConfig(async ({ requestLocale }) => {
  const headersList = await headers();
  const isAdminRoute = headersList.get('x-admin-route') === '1';

  if (isAdminRoute) {
    const cookieStore = await cookies();
    const locale = resolveAdminLocale(cookieStore.get('ADMIN_LOCALE')?.value);
    return {
      locale,
      messages: (await import(`../../messages/admin/${locale}.json`)).default,
    };
  }

  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale as string)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
