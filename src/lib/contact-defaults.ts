import { SOCIAL_LINKS } from '@/lib/social-links';

export const CONTACT_ADDRESS =
  '1181, 3-cü mərtəbə, Blok A, Xocalı prospekti, Bakı 1025, Azərbaycan';

/** Google Maps – Ostwind Group ofisi (tam ünvan ilə) */
export const CONTACT_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`Ostwind Group, ${CONTACT_ADDRESS}`);

export const DEFAULT_CONTACT = {
  address: CONTACT_ADDRESS,
  phone: '+994 10 345 22 22',
  email: 'info@ostwind.az',
  mapsUrl: CONTACT_MAPS_URL,
  hoursWeekdays: '09:00 – 18:00',
  hoursSaturday: '10:00 – 13:00',
  sundayClosed: true,
  hoursSunday: null as string | null,
  facebookUrl: SOCIAL_LINKS.facebook,
  instagramUrl: SOCIAL_LINKS.instagram,
  tiktokUrl: SOCIAL_LINKS.tiktok,
  pageSubtitle: {
    tr: 'Sorularınız için bize yazın, en kısa sürede dönüş yapalım.',
    en: 'Send us your questions and we will get back to you soon.',
    az: 'Suallarınızı bizə yazın, tezliklə cavab verək.',
    ru: 'Напишите нам, и мы скоро ответим.',
    uk: 'Напишіть нам, і ми незабаром відповімо.',
    ge: 'დაგვიკავშირდით და მალე გიპასუხებთ.',
  },
} as const;

export function phoneToE164(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string): string {
  const e164 = phoneToE164(phone) || phoneToE164(DEFAULT_CONTACT.phone);
  return `https://wa.me/${e164}`;
}

export function buildMailtoUrl(email: string): string {
  return `mailto:${email.trim()}`;
}
