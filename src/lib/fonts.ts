import { Manrope, Noto_Sans_Georgian } from 'next/font/google';

/** AZ/TR (ə, ı, ş…), EN, RU, UK — latın əlavə + kiril */
export const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
});

/** Gürcü dili (ge) */
export const notoGeorgian = Noto_Sans_Georgian({
  variable: '--font-noto-georgian',
  subsets: ['georgian'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const fontClassNames = `${manrope.variable} ${notoGeorgian.variable}`;
