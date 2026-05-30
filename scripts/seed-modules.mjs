import { PrismaClient } from '@prisma/client';
import { FAQ_TRANSLATIONS } from './faq-translations.mjs';
import { PRICING_PLANS } from './pricing-translations.mjs';

const prisma = new PrismaClient();

const locale = (tr, en, az, extra = {}) => ({
  tr,
  en,
  az,
  ru: extra.ru ?? tr,
  uk: extra.uk ?? tr,
  ge: extra.ge ?? tr,
});

const pricingPlans = PRICING_PLANS;

const faqs = FAQ_TRANSLATIONS;

const blogCategories = [
  {
    slug: 'egitim',
    name: locale('Eğitim', 'Education', 'Təhsil'),
  },
  {
    slug: 'vize',
    name: locale('Vize', 'Visa', 'Viza'),
  },
];

const blogPosts = [
  {
    slug: 'yurtdisinda-egitim-rehberi',
    published: true,
    categorySlug: 'egitim',
    image: '/images/hero/slide-01.jpg',
    title: locale(
      'Yurtdışında Eğitim Rehberi',
      'Study Abroad Guide',
      'Xaricdə Təhsil Bələdçisi'
    ),
    content: locale(
      'Yurtdışında eğitim planlarken ülke seçimi, bütçe ve dil yeterliliği en kritik adımlardır. OstWind Group uzmanları size kişiye özel yol haritası çıkarır.\n\nDoğru üniversite ve bölüm seçimi kariyer hedeflerinizle uyumlu olmalıdır.',
      'When planning to study abroad, country choice, budget, and language proficiency are critical. OstWind Group advisors create a personalized roadmap.\n\nThe right university and program should align with your career goals.',
      'Xaricdə təhsil planlaşdırarkən ölkə seçimi, büdcə və dil bilikləri ən vacib addımlardır. OstWind Group mütəxəssisləri sizin üçün fərdi yol xəritəsi hazırlayır.\n\nDüzgün universitet və ixtisas seçimi karyera məqsədlərinizlə uyğun olmalıdır.'
    ),
  },
  {
    slug: 'vize-surecinde-dikkat-edilecekler',
    published: true,
    categorySlug: 'vize',
    image: '/images/hero/slide-02.jpg',
    title: locale(
      'Vize Sürecinde Dikkat Edilecekler',
      'Visa Process Tips',
      'Viza Prosesində Diqqət Ediləcəklər'
    ),
    content: locale(
      'Vize başvurusunda eksik veya hatalı evrak en sık ret nedenidir. Tüm belgelerin güncel ve tercüme edilmiş olmasına dikkat edin.\n\nRandevu tarihinden önce danışmanınızla son kontrol yapmanızı öneririz.',
      'Incomplete or incorrect documents are the most common reason for visa rejection. Ensure all papers are current and translated.\n\nWe recommend a final review with your advisor before your appointment.',
      'Viza müraciətində natamam və ya səhv sənədlər ən çox rədd səbəbidir. Bütün sənədlərin aktual və tərcümə olunmasına diqqət yetirin.\n\nRandevu tarixindən əvvəl məsləhətçinizlə son yoxlama etməyinizi tövsiyə edirik.'
    ),
  },
];

const existingPlans = await prisma.pricingPlan.findMany({ orderBy: { id: 'asc' } });
if (existingPlans.length === 0) {
  await prisma.pricingPlan.createMany({ data: pricingPlans });
} else {
  for (let i = 0; i < existingPlans.length && i < pricingPlans.length; i++) {
    await prisma.pricingPlan.update({
      where: { id: existingPlans[i].id },
      data: {
        name: pricingPlans[i].name,
        features: pricingPlans[i].features,
        isPopular: pricingPlans[i].isPopular,
      },
    });
  }
}

const existingFaqs = await prisma.fAQ.findMany({ orderBy: { id: 'asc' } });
if (existingFaqs.length === 0) {
  await prisma.fAQ.createMany({ data: faqs });
} else {
  for (let i = 0; i < existingFaqs.length && i < faqs.length; i++) {
    await prisma.fAQ.update({
      where: { id: existingFaqs[i].id },
      data: faqs[i],
    });
  }
  for (let i = existingFaqs.length; i < faqs.length; i++) {
    await prisma.fAQ.create({ data: faqs[i] });
  }
}

const categoryIdBySlug = {};
for (const cat of blogCategories) {
  const row = await prisma.category.upsert({
    where: { slug: cat.slug },
    update: { name: cat.name },
    create: { slug: cat.slug, name: cat.name },
  });
  categoryIdBySlug[cat.slug] = row.id;
}

for (const post of blogPosts) {
  const { categorySlug, ...data } = post;
  const categoryId = categorySlug ? categoryIdBySlug[categorySlug] ?? null : null;
  await prisma.post.upsert({
    where: { slug: post.slug },
    update: { ...data, categoryId },
    create: { ...data, categoryId },
  });
}

console.log('Modül seed tamam: 3 plan, 8 SSS, 2 kategori, 2 blog yazısı.');
await prisma.$disconnect();
