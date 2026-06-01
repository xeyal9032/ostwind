/**
 * HomePageContent (SiteContentV2) — boş dil sahələrini messages/*.json ilə doldurur.
 * Mövcud dolu mətnlər saxlanılır; legacy (yalnız az/tr/en hero) formatı v2-yə keçirilir.
 *
 * İstifadə:
 *   node scripts/seed-site-content-6locales.mjs
 *   node scripts/seed-site-content-6locales.mjs --dry-run
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

const LOCALES = ['tr', 'en', 'az', 'ru', 'uk', 'ge'];
const SITE_CONTENT_VERSION = 2;

const HERO_SLIDES = [
  '/images/hero/slide-01.jpg',
  '/images/hero/slide-02.jpg',
  '/images/hero/slide-03.jpg',
  '/images/hero/slide-04.jpg',
  '/images/hero/slide-05.jpg',
  '/images/hero/slide-06.jpg',
  '/images/hero/slide-07.jpg',
  '/images/hero/slide-08.jpg',
  '/images/hero/slide-09.jpg',
  '/images/hero/slide-10.jpg',
];

const HERO_TEXT_KEYS = [
  'heroTitle1',
  'heroTitleHighlight',
  'heroDescription',
  'heroApplyNow',
  'heroExplore',
];

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
];

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
];

function loadMessages(loc) {
  return JSON.parse(readFileSync(join(ROOT, 'messages', `${loc}.json`), 'utf8'));
}

const ALL_MESSAGES = Object.fromEntries(LOCALES.map((loc) => [loc, loadMessages(loc)]));

function emptyLocaleMap() {
  return Object.fromEntries(LOCALES.map((k) => [k, '']));
}

function mapFromAllLocales(read) {
  const map = emptyLocaleMap();
  for (const loc of LOCALES) {
    map[loc] = read(ALL_MESSAGES[loc]) || '';
  }
  return map;
}

/** messages/*.json — 6 dil üçün tam ilkin məzmun */
function buildDefaultSiteContent() {
  const texts = {};
  for (const key of HERO_TEXT_KEYS) {
    texts[key] = mapFromAllLocales((m) => String(m.Home[key] ?? ''));
  }

  const header = {};
  for (const key of HEADER_KEYS) {
    header[key] = mapFromAllLocales((m) => m.Header[key] ?? '');
  }

  const footer = {};
  for (const key of FOOTER_KEYS) {
    footer[key] = mapFromAllLocales((m) => m.Footer[key] ?? '');
  }

  const feat = (k) => (m) => m.Home.features[k] ?? '';
  const featured = (k) => (m) => m.Home.featured[k] ?? '';
  const cta = (k) => (m) => m.Home.cta[k] ?? '';
  const stat = (k) => (m) => m.Home.stats[k] ?? '';

  return {
    v: SITE_CONTENT_VERSION,
    texts,
    heroSlides: [...HERO_SLIDES],
    stats: [
      { end: 10, suffix: '+', thousands: true, label: mapFromAllLocales(stat('students')) },
      { end: 120, suffix: '+', label: mapFromAllLocales(stat('universities')) },
      { end: 15, suffix: '+', label: mapFromAllLocales(stat('countries')) },
      { end: 99, suffix: '%', label: mapFromAllLocales(stat('acceptance')) },
    ],
    features: {
      title: mapFromAllLocales(feat('title')),
      subtitle: mapFromAllLocales(feat('subtitle')),
      cards: [
        {
          icon: '🎓',
          title: mapFromAllLocales(feat('card1Title')),
          desc: mapFromAllLocales(feat('card1Desc')),
        },
        {
          icon: '🤝',
          title: mapFromAllLocales(feat('card2Title')),
          desc: mapFromAllLocales(feat('card2Desc')),
        },
        {
          icon: '✈️',
          title: mapFromAllLocales(feat('card3Title')),
          desc: mapFromAllLocales(feat('card3Desc')),
        },
      ],
    },
    featured: {
      title: mapFromAllLocales(featured('title')),
      viewAll: mapFromAllLocales(featured('viewAll')),
      viewDetails: mapFromAllLocales(featured('viewDetails')),
      noUniversities: mapFromAllLocales(featured('noUniversities')),
    },
    cta: {
      title: mapFromAllLocales(cta('title')),
      desc: mapFromAllLocales(cta('desc')),
      button: mapFromAllLocales(cta('button')),
    },
    header,
    footer,
  };
}

function isLegacyContent(raw) {
  return (
    typeof raw.tr === 'object' &&
    raw.tr !== null &&
    !Array.isArray(raw.tr) &&
    'heroTitle1' in raw.tr
  );
}

function migrateLegacyToV2(raw) {
  const base = buildDefaultSiteContent();
  for (const loc of LOCALES) {
    const block = raw[loc];
    if (!block || typeof block !== 'object') continue;
    for (const key of HERO_TEXT_KEYS) {
      if (block[key]) {
        base.texts[key] = { ...base.texts[key], [loc]: String(block[key]) };
      }
    }
  }
  return base;
}

function normalizeSiteContent(raw) {
  const defaults = buildDefaultSiteContent();
  if (!raw || typeof raw !== 'object') return defaults;
  if (raw.v === SITE_CONTENT_VERSION) {
    return {
      ...defaults,
      ...raw,
      texts: { ...defaults.texts, ...(raw.texts || {}) },
      header: { ...defaults.header, ...(raw.header || {}) },
      footer: { ...defaults.footer, ...(raw.footer || {}) },
      featured: { ...defaults.featured, ...(raw.featured || {}) },
      cta: { ...defaults.cta, ...(raw.cta || {}) },
      features: {
        ...defaults.features,
        ...(raw.features || {}),
        cards: raw.features?.cards?.length
          ? raw.features.cards
          : defaults.features.cards,
      },
      stats: raw.stats?.length ? raw.stats : defaults.stats,
      heroSlides:
        Array.isArray(raw.heroSlides) && raw.heroSlides.filter(Boolean).length
          ? raw.heroSlides.filter(Boolean)
          : defaults.heroSlides,
    };
  }
  if (isLegacyContent(raw)) return migrateLegacyToV2(raw);
  return defaults;
}

/** DB dəyəri qorunur; boş dillər defaults ilə doldurulur */
function mergeLocaleMap(dbMap, defaultMap) {
  const out = emptyLocaleMap();
  for (const loc of LOCALES) {
    const dbVal = typeof dbMap?.[loc] === 'string' ? dbMap[loc].trim() : '';
    const defVal = typeof defaultMap?.[loc] === 'string' ? defaultMap[loc].trim() : '';
    out[loc] = dbVal || defVal || '';
  }
  return out;
}

function mergeSiteContentWithDefaults(current, defaults) {
  const texts = {};
  for (const key of HERO_TEXT_KEYS) {
    texts[key] = mergeLocaleMap(current.texts?.[key], defaults.texts[key]);
  }

  const header = {};
  for (const key of HEADER_KEYS) {
    header[key] = mergeLocaleMap(current.header?.[key], defaults.header[key]);
  }

  const footer = {};
  for (const key of FOOTER_KEYS) {
    footer[key] = mergeLocaleMap(current.footer?.[key], defaults.footer[key]);
  }

  const featured = {};
  for (const key of Object.keys(defaults.featured)) {
    featured[key] = mergeLocaleMap(current.featured?.[key], defaults.featured[key]);
  }

  const cta = {};
  for (const key of Object.keys(defaults.cta)) {
    cta[key] = mergeLocaleMap(current.cta?.[key], defaults.cta[key]);
  }

  const stats = defaults.stats.map((defStat, i) => {
    const cur = current.stats?.[i] || {};
    return {
      end: typeof cur.end === 'number' ? cur.end : defStat.end,
      suffix: cur.suffix ?? defStat.suffix,
      thousands: cur.thousands ?? defStat.thousands,
      label: mergeLocaleMap(cur.label, defStat.label),
    };
  });

  const defCards = defaults.features.cards;
  const curCards = current.features?.cards || [];
  const cards = defCards.map((defCard, i) => {
    const cur = curCards[i] || {};
    return {
      icon: (cur.icon && String(cur.icon).trim()) || defCard.icon,
      title: mergeLocaleMap(cur.title, defCard.title),
      desc: mergeLocaleMap(cur.desc, defCard.desc),
    };
  });

  const heroSlides =
    Array.isArray(current.heroSlides) && current.heroSlides.filter(Boolean).length
      ? current.heroSlides.filter(Boolean)
      : defaults.heroSlides;

  return {
    v: SITE_CONTENT_VERSION,
    texts,
    heroSlides,
    stats,
    features: {
      title: mergeLocaleMap(current.features?.title, defaults.features.title),
      subtitle: mergeLocaleMap(current.features?.subtitle, defaults.features.subtitle),
      cards,
    },
    featured,
    cta,
    header,
    footer,
  };
}

function countEmptyLocaleSlots(content) {
  let empty = 0;
  let total = 0;

  const scan = (map) => {
    if (!map || typeof map !== 'object') return;
    for (const loc of LOCALES) {
      total += 1;
      if (!String(map[loc] ?? '').trim()) empty += 1;
    }
  };

  for (const key of HERO_TEXT_KEYS) scan(content.texts?.[key]);
  for (const key of HEADER_KEYS) scan(content.header?.[key]);
  for (const key of FOOTER_KEYS) scan(content.footer?.[key]);
  for (const key of Object.keys(content.featured || {})) scan(content.featured[key]);
  for (const key of Object.keys(content.cta || {})) scan(content.cta[key]);
  scan(content.features?.title);
  scan(content.features?.subtitle);
  for (const card of content.features?.cards || []) {
    scan(card.title);
    scan(card.desc);
  }
  for (const stat of content.stats || []) scan(stat.label);

  return { empty, total };
}

const prisma = new PrismaClient();

try {
  const defaults = buildDefaultSiteContent();
  const row = await prisma.homePageContent.findUnique({ where: { id: 1 } });

  const beforeRaw = row?.content ?? null;
  const before = normalizeSiteContent(beforeRaw);
  const beforeStats = countEmptyLocaleSlots(before);

  const merged = mergeSiteContentWithDefaults(before, defaults);
  const afterStats = countEmptyLocaleSlots(merged);

  const filled = beforeStats.empty - afterStats.empty;
  const format = beforeRaw?.v === SITE_CONTENT_VERSION ? 'v2' : isLegacyContent(beforeRaw || {}) ? 'legacy' : 'yox/boş';

  console.log('--- SiteContent 6 dil seed ---');
  console.log(`DB formatı: ${format}`);
  console.log(
    `Boş dil slotları: ${beforeStats.empty}/${beforeStats.total} → ${afterStats.empty}/${afterStats.total} (${filled} dolduruldu)`,
  );
  console.log(`Hero slayd sayı: ${merged.heroSlides.length}`);

  if (DRY_RUN) {
    console.log('\n--dry-run: DB yazılmadı.');
  } else {
    await prisma.homePageContent.upsert({
      where: { id: 1 },
      create: { id: 1, content: merged },
      update: { content: merged },
    });
    console.log('\nHomePageContent (id=1) yeniləndi.');
  }
} catch (err) {
  console.error('Xəta:', err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
