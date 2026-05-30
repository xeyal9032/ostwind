import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADDRESS = '1181, 3-cü mərtəbə, Blok A, Xocalı prospekti, Bakı 1025, Azərbaycan';

const DEFAULT = {
  address: ADDRESS,
  phone: '+994 10 345 22 22',
  email: 'info@ostwind.az',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(`Ostwind Group, ${ADDRESS}`),
  hoursWeekdays: '09:00 – 18:00',
  hoursSaturday: '10:00 – 13:00',
  sundayClosed: true,
  hoursSunday: null,
  facebookUrl: 'https://www.facebook.com/OstWind.LLC/',
  instagramUrl: 'https://www.instagram.com/ostwind.group/',
  tiktokUrl: 'https://www.tiktok.com/@ostwind.llc',
  pageSubtitle: {
    tr: 'Sorularınız için bize yazın, en kısa sürede dönüş yapalım.',
    en: 'Send us your questions and we will get back to you soon.',
    az: 'Suallarınızı bizə yazın, tezliklə cavab verək.',
    ru: 'Напишите нам, и мы скоро ответим.',
    uk: 'Напишіть нам, і ми незабаром відповімо.',
    ge: 'დაგვიკავშირდით და მალე გიპასუხებთ.',
  },
};

await prisma.contactContent.upsert({
  where: { id: 1 },
  create: { id: 1, ...DEFAULT },
  update: DEFAULT,
});

console.log('ContactContent seed tamamlandı.');
await prisma.$disconnect();
