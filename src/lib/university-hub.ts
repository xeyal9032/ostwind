import hubDefaultMediaJson from '../../data/hub-default-media.json';
import { prisma } from '@/prisma';
import { getLocaleText, EMPTY_LOCALES, type LocaleKey } from '@/lib/locale-content';
import { notDeleted } from '@/lib/soft-delete';

export const HUB_ACCENT_COLORS = [
  'blue',
  'indigo',
  'violet',
  'amber',
  'emerald',
  'rose',
  'cyan',
  'orange',
] as const;

export type HubAccentColor = (typeof HUB_ACCENT_COLORS)[number];

/** Kart gradient sinifləri */
export const HUB_ACCENT_STYLES: Record<
  HubAccentColor,
  { gradient: string; ring: string; glow: string }
> = {
  blue: {
    gradient: 'from-blue-600 via-blue-700 to-indigo-900',
    ring: 'ring-blue-400/40',
    glow: 'shadow-blue-500/25',
  },
  indigo: {
    gradient: 'from-indigo-600 via-indigo-700 to-violet-900',
    ring: 'ring-indigo-400/40',
    glow: 'shadow-indigo-500/25',
  },
  violet: {
    gradient: 'from-violet-600 via-purple-700 to-fuchsia-900',
    ring: 'ring-violet-400/40',
    glow: 'shadow-violet-500/25',
  },
  amber: {
    gradient: 'from-amber-500 via-orange-600 to-red-900',
    ring: 'ring-amber-400/40',
    glow: 'shadow-amber-500/25',
  },
  emerald: {
    gradient: 'from-emerald-600 via-teal-700 to-cyan-900',
    ring: 'ring-emerald-400/40',
    glow: 'shadow-emerald-500/25',
  },
  rose: {
    gradient: 'from-rose-600 via-pink-700 to-red-900',
    ring: 'ring-rose-400/40',
    glow: 'shadow-rose-500/25',
  },
  cyan: {
    gradient: 'from-cyan-600 via-sky-700 to-blue-900',
    ring: 'ring-cyan-400/40',
    glow: 'shadow-cyan-500/25',
  },
  orange: {
    gradient: 'from-orange-500 via-amber-600 to-yellow-800',
    ring: 'ring-orange-400/40',
    glow: 'shadow-orange-500/25',
  },
};

export function resolveHubAccent(color: string | null | undefined): HubAccentColor {
  if (color && HUB_ACCENT_COLORS.includes(color as HubAccentColor)) {
    return color as HubAccentColor;
  }
  return 'blue';
}

export function getHubAccentStyle(color: string | null | undefined) {
  return HUB_ACCENT_STYLES[resolveHubAccent(color)];
}

export async function getActiveUniversityHubs() {
  return prisma.universityHub.findMany({
    where: { ...notDeleted, isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: {
      _count: {
        select: {
          universities: { where: notDeleted },
        },
      },
      universities: {
        where: { ...notDeleted, image: { not: null } },
        take: 1,
        orderBy: { createdAt: 'asc' },
        select: { image: true },
      },
    },
  });
}

export async function getUniversityHubBySlug(slug: string) {
  return prisma.universityHub.findFirst({
    where: { slug, ...notDeleted, isActive: true },
  });
}

export function hubTitle(hub: { title: unknown }, locale: string): string {
  return getLocaleText(hub.title, locale);
}

export function hubSubtitle(hub: { subtitle?: unknown }, locale: string): string {
  return getLocaleText(hub.subtitle, locale);
}

export function emptyHubLocales(): Record<LocaleKey, string> {
  return { ...EMPTY_LOCALES } as Record<LocaleKey, string>;
}

/** Slug üzrə default bayraq və kampus şəkli (public/images/hubs) */
export const HUB_DEFAULT_MEDIA: Record<string, { flag: string; image: string }> =
  hubDefaultMediaJson;

export function resolveHubFlagUrl(hub: {
  slug: string;
  flagImage?: string | null;
  icon?: string | null;
}): string | null {
  if (hub.flagImage?.trim()) return hub.flagImage.trim();
  if (hub.icon?.startsWith('http')) return hub.icon.trim();
  return HUB_DEFAULT_MEDIA[hub.slug]?.flag ?? null;
}

export function resolveHubCampusImage(
  hub: { slug: string; image?: string | null },
  featuredUniversityImage?: string | null,
): string | null {
  if (hub.image?.trim()) return hub.image.trim();
  if (featuredUniversityImage?.trim()) return featuredUniversityImage.trim();
  return HUB_DEFAULT_MEDIA[hub.slug]?.image ?? null;
}

/** DB-dəki URL sınır olsa, lokal default kampus yolu */
export function hubCampusFallback(slug: string): string | null {
  return HUB_DEFAULT_MEDIA[slug]?.image ?? null;
}
