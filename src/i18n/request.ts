import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // Gelen locale parametresinin geçerli olduğunu doğrula
  if (!locale || !(routing.locales as readonly string[]).includes(locale as string)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Dil dosyalarını dinamik olarak yükle (Kök dizindeki messages klasöründen)
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
