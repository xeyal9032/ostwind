import { PrismaClient } from '@prisma/client';
import { FAQ_TRANSLATIONS } from './faq-translations.mjs';

const prisma = new PrismaClient();

const existing = await prisma.fAQ.findMany({ orderBy: { id: 'asc' } });

if (existing.length === 0) {
  await prisma.fAQ.createMany({ data: FAQ_TRANSLATIONS });
  console.log(`${FAQ_TRANSLATIONS.length} SSS oluşturuldu.`);
} else {
  for (let i = 0; i < existing.length && i < FAQ_TRANSLATIONS.length; i++) {
    const row = existing[i];
    const data = FAQ_TRANSLATIONS[i];
    await prisma.fAQ.update({
      where: { id: row.id },
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
      },
    });
    console.log(`Güncellendi #${row.id}: ${data.question.tr.slice(0, 50)}…`);
  }
  if (existing.length < FAQ_TRANSLATIONS.length) {
    for (let i = existing.length; i < FAQ_TRANSLATIONS.length; i++) {
      await prisma.fAQ.create({ data: FAQ_TRANSLATIONS[i] });
      console.log(`Eklendi: ${FAQ_TRANSLATIONS[i].question.tr.slice(0, 50)}…`);
    }
  }
}

console.log('SSS çevirileri (ru, uk, ge) güncellendi.');
await prisma.$disconnect();
