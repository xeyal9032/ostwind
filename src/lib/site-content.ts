import { prisma } from '@/prisma';
import { LOCALE_KEYS, type LocaleKey } from '@/lib/locale-content';
import { HERO_SLIDES } from '@/lib/hero-slides';
import azMessages from '../../messages/az.json';
import trMessages from '../../messages/tr.json';
import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';
import ukMessages from '../../messages/uk.json';
import geMessages from '../../messages/ge.json';

const ALL_MESSAGES: Record<LocaleKey, typeof azMessages> = {
  az: azMessages,
  tr: trMessages,
  en: enMessages,
  ru: ruMessages,
  uk: ukMessages,
  ge: geMessages,
};

export const SITE_CONTENT_VERSION = 2;

export type LocaleMap = Record<string, string>;

export type HomeStatItem = {
  end: number;
  suffix: string;
  thousands?: boolean;
  label: LocaleMap;
};

export type HomeFeatureCard = {
  icon: string;
  title: LocaleMap;
  desc: LocaleMap;
};

export type SiteContentV2 = {
  v: typeof SITE_CONTENT_VERSION;
  texts: Record<string, LocaleMap>;
  heroSlides: string[];
  stats: HomeStatItem[];
  features: {
    title: LocaleMap;
    subtitle: LocaleMap;
    cards: HomeFeatureCard[];
  };
  featured: {
    title: LocaleMap;
    viewAll: LocaleMap;
    viewDetails: LocaleMap;
    noUniversities: LocaleMap;
  };
  cta: {
    title: LocaleMap;
    desc: LocaleMap;
    button: LocaleMap;
  };
  header: Record<string, LocaleMap>;
  footer: Record<string, LocaleMap>;
};

const HERO_TEXT_KEYS = [
  'heroTitle1',
  'heroTitleHighlight',
  'heroDescription',
  'heroApplyNow',
  'heroExplore',
] as const;

const HEADER_KEYS = [
  'home',
  'universities',
  'services',
  'pricing',
  'faq',
  'blog',
  'about',
  'contact',
  'applyNow',
  'login',
  'register',
  'onlineAdmission',
] as const;

const FOOTER_KEYS = [
  'description',
  'quickLinks',
  'universities',
  'services',
  'pricing',
  'faq',
  'blog',
  'about',
  'contact',
  'contactUs',
  'followUs',
  'language',
  'allRightsReserved',
] as const;

function emptyLocaleMap(): LocaleMap {
  return Object.fromEntries(LOCALE_KEYS.map((k) => [k, '']));
}

function mapFromAllLocales(
  read: (messages: typeof azMessages) => string | undefined,
): LocaleMap {
  const map = emptyLocaleMap();
  for (const loc of LOCALE_KEYS) {
    map[loc] = read(ALL_MESSAGES[loc]) || '';
  }
  return map;
}

/** messages/*.json (6 dil) əsasında ilkin struktur */
export function buildDefaultSiteContent(): SiteContentV2 {
  const texts: Record<string, LocaleMap> = {};
  for (const key of HERO_TEXT_KEYS) {
    texts[key] = mapFromAllLocales((m) => String((m.Home as Record<string, unknown>)[key] ?? ''));
  }

  const headerMap: Record<string, LocaleMap> = {};
  for (const key of HEADER_KEYS) {
    headerMap[key] = mapFromAllLocales((m) => m.Header[key as keyof typeof m.Header]);
  }

  const footerMap: Record<string, LocaleMap> = {};
  for (const key of FOOTER_KEYS) {
    footerMap[key] = mapFromAllLocales((m) => m.Footer[key as keyof typeof m.Footer]);
  }

  return {
    v: SITE_CONTENT_VERSION,
    texts,
    heroSlides: [...HERO_SLIDES],
    stats: [
      {
        end: 10,
        suffix: '+',
        thousands: true,
        label: mapFromAllLocales((m) => (m.Home.stats as Record<string, string>).students),
      },
      {
        end: 120,
        suffix: '+',
        label: mapFromAllLocales((m) => (m.Home.stats as Record<string, string>).universities),
      },
      {
        end: 15,
        suffix: '+',
        label: mapFromAllLocales((m) => (m.Home.stats as Record<string, string>).countries),
      },
      {
        end: 99,
        suffix: '%',
        label: mapFromAllLocales((m) => (m.Home.stats as Record<string, string>).acceptance),
      },
    ],
    features: {
      title: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).title),
      subtitle: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).subtitle),
      cards: [
        {
          icon: '🎓',
          title: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).card1Title),
          desc: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).card1Desc),
        },
        {
          icon: '🤝',
          title: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).card2Title),
          desc: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).card2Desc),
        },
        {
          icon: '✈️',
          title: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).card3Title),
          desc: mapFromAllLocales((m) => (m.Home.features as Record<string, string>).card3Desc),
        },
      ],
    },
    featured: {
      title: mapFromAllLocales((m) => (m.Home.featured as Record<string, string>).title),
      viewAll: mapFromAllLocales((m) => (m.Home.featured as Record<string, string>).viewAll),
      viewDetails: mapFromAllLocales((m) => (m.Home.featured as Record<string, string>).viewDetails),
      noUniversities: mapFromAllLocales(
        (m) => (m.Home.featured as Record<string, string>).noUniversities,
      ),
    },
    cta: {
      title: mapFromAllLocales((m) => (m.Home.cta as Record<string, string>).title),
      desc: mapFromAllLocales((m) => (m.Home.cta as Record<string, string>).desc),
      button: mapFromAllLocales((m) => (m.Home.cta as Record<string, string>).button),
    },
    header: headerMap,
    footer: footerMap,
  };
}

function isLegacyContent(raw: Record<string, unknown>): boolean {
  return (
    typeof raw.tr === 'object' &&
    raw.tr !== null &&
    !Array.isArray(raw.tr) &&
    'heroTitle1' in (raw.tr as object)
  );
}

function migrateLegacyToV2(raw: Record<string, unknown>): SiteContentV2 {
  const base = buildDefaultSiteContent();
  for (const loc of LOCALE_KEYS) {
    const block = raw[loc] as Record<string, string> | undefined;
    if (!block) continue;
    for (const key of HERO_TEXT_KEYS) {
      if (block[key]) {
        base.texts[key] = { ...base.texts[key], [loc]: block[key] };
      }
    }
  }
  return base;
}

export function normalizeSiteContent(raw: unknown): SiteContentV2 {
  if (!raw || typeof raw !== 'object') return buildDefaultSiteContent();
  const o = raw as Record<string, unknown>;
  if (o.v === SITE_CONTENT_VERSION) {
    const c = o as unknown as SiteContentV2;
    return {
      ...buildDefaultSiteContent(),
      ...c,
      texts: { ...buildDefaultSiteContent().texts, ...c.texts },
      heroSlides: Array.isArray(c.heroSlides) && c.heroSlides.length > 0 ? c.heroSlides : [...HERO_SLIDES],
    };
  }
  if (isLegacyContent(o)) return migrateLegacyToV2(o);
  return buildDefaultSiteContent();
}

export async function getSiteContent(): Promise<SiteContentV2> {
  try {
    const row = await prisma.homePageContent.findUnique({ where: { id: 1 } });
    if (!row?.content) return buildDefaultSiteContent();
    return normalizeSiteContent(row.content);
  } catch {
    return buildDefaultSiteContent();
  }
}

export async function saveSiteContent(content: SiteContentV2) {
  return prisma.homePageContent.upsert({
    where: { id: 1 },
    create: { id: 1, content: content as unknown as object },
    update: { content: content as unknown as object },
  });
}

export function resolveLocaleText(
  map: LocaleMap | undefined,
  locale: string,
  fallback: string,
): string {
  if (!map) return fallback;
  const order: string[] = [locale, ...LOCALE_KEYS];
  for (const key of order) {
    const v = map[key]?.trim();
    if (v) return v;
  }
  return fallback;
}

export function resolveHomeTextKey(
  content: SiteContentV2,
  key: string,
  locale: string,
  fallback: string,
): string {
  return resolveLocaleText(content.texts[key], locale, fallback);
}

export function resolveHeaderText(
  content: SiteContentV2,
  key: string,
  locale: string,
  fallback: string,
): string {
  return resolveLocaleText(content.header[key], locale, fallback);
}

export function resolveFooterText(
  content: SiteContentV2,
  key: string,
  locale: string,
  fallback: string,
): string {
  return resolveLocaleText(content.footer[key], locale, fallback);
}

export {
  HERO_TEXT_KEYS,
  HEADER_KEYS,
  FOOTER_KEYS,
};

export type { LocaleKey };
