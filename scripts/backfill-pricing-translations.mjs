import { PrismaClient } from '@prisma/client';
import { PRICING_PLANS } from './pricing-translations.mjs';

const prisma = new PrismaClient();

const existing = await prisma.pricingPlan.findMany({ orderBy: { id: 'asc' } });

if (existing.length === 0) {
  await prisma.pricingPlan.createMany({ data: PRICING_PLANS });
  console.log(`${PRICING_PLANS.length} plan oluşturuldu.`);
} else {
  for (let i = 0; i < existing.length && i < PRICING_PLANS.length; i++) {
    const row = existing[i];
    const data = PRICING_PLANS[i];
    await prisma.pricingPlan.update({
      where: { id: row.id },
      data: {
        name: data.name,
        features: data.features,
        isPopular: data.isPopular,
      },
    });
    console.log(`Güncellendi #${row.id} (${row.price}): ${data.name.ru}`);
  }
}

console.log('Fiyatlandırma çevirileri (ru, uk, ge) güncellendi.');
await prisma.$disconnect();
