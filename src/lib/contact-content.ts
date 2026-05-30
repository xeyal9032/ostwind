import { prisma } from '@/prisma';
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  DEFAULT_CONTACT,
  phoneToE164,
} from '@/lib/contact-defaults';
import { getLocaleText, mergeLocaleJson } from '@/lib/about-defaults';

export type ContactContentPublic = {
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
  hoursWeekdays: string;
  hoursSaturday: string;
  sundayClosed: boolean;
  hoursSunday: string | null;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  phoneE164: string;
  whatsappUrl: string;
  mailtoUrl: string;
  pageSubtitle: Record<string, string>;
};

function mapRow(row: {
  address: string;
  phone: string;
  email: string;
  mapsUrl: string | null;
  hoursWeekdays: string;
  hoursSaturday: string;
  sundayClosed: boolean;
  hoursSunday: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  pageSubtitle: unknown;
}): ContactContentPublic {
  const phone = row.phone.trim() || DEFAULT_CONTACT.phone;
  const email = row.email.trim() || DEFAULT_CONTACT.email;

  return {
    address: row.address.trim() || DEFAULT_CONTACT.address,
    phone,
    email,
    mapsUrl: row.mapsUrl?.trim() || DEFAULT_CONTACT.mapsUrl,
    hoursWeekdays: row.hoursWeekdays.trim() || DEFAULT_CONTACT.hoursWeekdays,
    hoursSaturday: row.hoursSaturday.trim() || DEFAULT_CONTACT.hoursSaturday,
    sundayClosed: row.sundayClosed,
    hoursSunday: row.hoursSunday?.trim() || null,
    facebookUrl: row.facebookUrl?.trim() || DEFAULT_CONTACT.facebookUrl,
    instagramUrl: row.instagramUrl?.trim() || DEFAULT_CONTACT.instagramUrl,
    tiktokUrl: row.tiktokUrl?.trim() || DEFAULT_CONTACT.tiktokUrl,
    phoneE164: phoneToE164(phone),
    whatsappUrl: buildWhatsAppUrl(phone),
    mailtoUrl: buildMailtoUrl(email),
    pageSubtitle: mergeLocaleJson(row.pageSubtitle ?? DEFAULT_CONTACT.pageSubtitle),
  };
}

export function getDefaultContactPublic(): ContactContentPublic {
  return mapRow({
    address: DEFAULT_CONTACT.address,
    phone: DEFAULT_CONTACT.phone,
    email: DEFAULT_CONTACT.email,
    mapsUrl: DEFAULT_CONTACT.mapsUrl,
    hoursWeekdays: DEFAULT_CONTACT.hoursWeekdays,
    hoursSaturday: DEFAULT_CONTACT.hoursSaturday,
    sundayClosed: DEFAULT_CONTACT.sundayClosed,
    hoursSunday: DEFAULT_CONTACT.hoursSunday,
    facebookUrl: DEFAULT_CONTACT.facebookUrl,
    instagramUrl: DEFAULT_CONTACT.instagramUrl,
    tiktokUrl: DEFAULT_CONTACT.tiktokUrl,
    pageSubtitle: DEFAULT_CONTACT.pageSubtitle,
  });
}

export async function getContactContent(): Promise<ContactContentPublic> {
  try {
    const row = await prisma.contactContent.findUnique({ where: { id: 1 } });
    if (!row) return getDefaultContactPublic();
    return mapRow(row);
  } catch {
    return getDefaultContactPublic();
  }
}

export function getContactSubtitle(content: ContactContentPublic, locale: string, fallback: string) {
  const text = getLocaleText(content.pageSubtitle, locale);
  return text.trim() || fallback;
}
