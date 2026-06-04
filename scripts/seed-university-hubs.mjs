/**
 * Ölkə/region hub-ları və mövcud universitetləri Ukraynaya bağlayır.
 * node scripts/seed-university-hubs.mjs
 */
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MEDIA = JSON.parse(
  readFileSync(new URL('../data/hub-default-media.json', import.meta.url), 'utf8'),
);

const HUBS = [
  {
    slug: 'ukraine',
    sortOrder: 1,
    icon: '🇺🇦',
    accentColor: 'blue',
    title: {
      az: 'Ukrayna Universitetləri',
      tr: 'Ukrayna Üniversiteleri',
      en: 'Ukraine Universities',
      ru: 'Университеты Украины',
      uk: 'Університети України',
      ge: 'უკრაინის უნივერსიტეტები',
    },
    subtitle: {
      az: 'Kharkiv, Kyiv və digər şəhərlərdə dövlət və özəl universitetlər',
      tr: 'Kharkiv, Kyiv ve diğer şehirlerde devlet ve özel üniversiteler',
      en: 'Public and private universities in Kharkiv, Kyiv and more',
      ru: 'Государственные и частные вузы Харькова, Киева и других городов',
      uk: 'Державні та приватні вузи Харкова, Києва та інших міст',
      ge: 'ხარკოვი, კიევი და სხვა ქალაქების უნივერსიტეტები',
    },
  },
  {
    slug: 'turkey',
    sortOrder: 2,
    icon: '🇹🇷',
    accentColor: 'rose',
    title: {
      az: 'Türkiyə Universitetləri',
      tr: 'Türkiye Üniversiteleri',
      en: 'Turkey Universities',
      ru: 'Университеты Турции',
      uk: 'Університети Туреччини',
      ge: 'თურქეთის უნივერსიტეტები',
    },
    subtitle: {
      az: 'Türkiyədə beynəlxalq tələbələr üçün proqramlar',
      tr: 'Türkiye’de uluslararası öğrenciler için programlar',
      en: 'Programs for international students in Turkey',
      ru: 'Программы для иностранных студентов в Турции',
      uk: 'Програми для іноземних студентів у Туреччині',
      ge: 'საერთაშორისო სტუდენტებისთვის პროგრამები',
    },
  },
  {
    slug: 'europe',
    sortOrder: 3,
    icon: '🇪🇺',
    accentColor: 'indigo',
    title: {
      az: 'Avropa Universitetləri',
      tr: 'Avrupa Üniversiteleri',
      en: 'Europe Universities',
      ru: 'Университеты Европы',
      uk: 'Європейські університети',
      ge: 'ევროპის უნივერსიტეტები',
    },
    subtitle: {
      az: 'Polşa, Çexiya, Macarıstan və digər Avropa ölkələri',
      tr: 'Polonya, Çekya, Macaristan ve diğer Avrupa ülkeleri',
      en: 'Poland, Czechia, Hungary and more European destinations',
      ru: 'Польша, Чехия, Венгрия и другие страны Европы',
      uk: 'Польща, Чехія, Угорщина та інші країни Європи',
      ge: 'პოლონეთი, ჩეხეთი, უნგრეთი და სხვა',
    },
  },
  {
    slug: 'uzbekistan',
    sortOrder: 4,
    icon: '🇺🇿',
    accentColor: 'emerald',
    title: {
      az: 'Özbəkistan Universitetləri',
      tr: 'Özbekistan Üniversiteleri',
      en: 'Uzbekistan Universities',
      ru: 'Университеты Узбекистана',
      uk: 'Університети Узбекистану',
      ge: 'უზბეკეთის უნივერსიტეტები',
    },
    subtitle: {
      az: 'Özbəkistanda təhsil imkanları',
      tr: 'Özbekistan’da eğitim fırsatları',
      en: 'Study opportunities in Uzbekistan',
      ru: 'Возможности обучения в Узбекистане',
      uk: 'Можливості навчання в Узбекистані',
      ge: 'სწავლის შესაძლებლობები უზბეკეთში',
    },
  },
];

try {
  for (const hub of HUBS) {
    const media = MEDIA[hub.slug] ?? {};
    const payload = {
      ...hub,
      flagImage: media.flag ?? null,
      image: media.image ?? null,
    };
    await prisma.universityHub.upsert({
      where: { slug: hub.slug },
      create: payload,
      update: {
        title: hub.title,
        subtitle: hub.subtitle,
        icon: hub.icon,
        flagImage: media.flag ?? null,
        image: media.image ?? null,
        accentColor: hub.accentColor,
        sortOrder: hub.sortOrder,
        isActive: true,
        deletedAt: null,
      },
    });
    console.log(`Hub: ${hub.slug}`);
  }

  const ukraine = await prisma.universityHub.findUnique({ where: { slug: 'ukraine' } });
  if (ukraine) {
    const r = await prisma.university.updateMany({
      where: { hubId: null, deletedAt: null },
      data: { hubId: ukraine.id },
    });
    console.log(`${r.count} universitet Ukrayna hub-ına bağlandı.`);
  }

  console.log('University hub seed tamamlandı.');
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
