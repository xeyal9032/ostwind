/**
 * Bozuk Unsplash blog şəkillərini düzəldir.
 * İstifadə: node scripts/fix-blog-images.mjs
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const FALLBACK = '/images/hero/slide-01.jpg';
const BROKEN = [
  'photo-1523050854058-8df90110c9f1',
  'photo-1434030214721-40b81132893c',
];

const posts = await prisma.post.findMany({
  where: { image: { not: null } },
  select: { id: true, slug: true, image: true, published: true },
});

let fixed = 0;
for (const post of posts) {
  if (!post.image || !BROKEN.some((id) => post.image.includes(id))) continue;
  await prisma.post.update({
    where: { id: post.id },
    data: { image: FALLBACK },
  });
  console.log(`Şəkil düzəldildi: ${post.slug} → ${FALLBACK}`);
  fixed++;
}

const unpublished = await prisma.post.count({ where: { published: false, deletedAt: null } });
console.log(`\nYayında olmayan (taslak) yazı: ${unpublished}`);
if (unpublished > 0) {
  console.log('İpucu: Admin → Blog → Düzenle → "Yayınla" işaretleyin.');
}

console.log(fixed ? `\n${fixed} yazı yeniləndi.` : '\nDüzəldiləcək şəkil tapılmadı.');
await prisma.$disconnect();
