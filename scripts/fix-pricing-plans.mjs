import { PrismaClient } from '@prisma/client';
import { PRICING_PLANS } from './pricing-translations.mjs';

const prisma = new PrismaClient();

// Seed ile eklenen yinelenen TRY planlarını kaldır
const removed = await prisma.pricingPlan.deleteMany({
  where: { price: { in: ['₺4.999', '₺9.999', '₺19.999'] } },
});
console.log(`Silinen yinelenen plan: ${removed.count}`);

const existing = await prisma.pricingPlan.findMany({ orderBy: { id: 'asc' } });

for (let i = 0; i < existing.length && i < PRICING_PLANS.length; i++) {
  const row = existing[i];
  const translated = PRICING_PLANS[i];
  await prisma.pricingPlan.update({
    where: { id: row.id },
    data: {
      name: translated.name,
      features: translated.features,
      isPopular: translated.isPopular,
      // Mevcut fiyat (600$, 1000$ vb.) korunur
    },
  });
  console.log(`Güncellendi #${row.id} ${row.price} → ru: ${translated.name.ru}`);
}

console.log('Tamam.');
await prisma.$disconnect();
