/**
 * Veritabanı tablolarındaki kayıt sayılarını gösterir.
 * İstifadə: node scripts/db-stats.mjs
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tables = [
  { label: 'Admin istifadəçilər', count: () => prisma.user.count() },
  { label: 'Admin oturumları', count: () => prisma.adminSession.count() },
  { label: 'Audit log', count: () => prisma.adminAuditLog.count() },
  { label: 'Üniversitetlər', count: () => prisma.university.count() },
  { label: '  ↳ aktiv (silinməyib)', count: () => prisma.university.count({ where: { deletedAt: null } }) },
  { label: '  ↳ zibil qutusu', count: () => prisma.university.count({ where: { deletedAt: { not: null } } }) },
  { label: 'Xidmətlər', count: () => prisma.service.count() },
  { label: '  ↳ aktiv', count: () => prisma.service.count({ where: { deletedAt: null } }) },
  { label: 'Qiymət planları', count: () => prisma.pricingPlan.count() },
  { label: 'SSS (FAQ)', count: () => prisma.fAQ.count() },
  { label: 'Blog kateqoriyaları', count: () => prisma.category.count() },
  { label: 'Blog yazıları', count: () => prisma.post.count() },
  { label: '  ↳ yayımda', count: () => prisma.post.count({ where: { published: true, deletedAt: null } }) },
  { label: '  ↳ taslak', count: () => prisma.post.count({ where: { published: false, deletedAt: null } }) },
  { label: 'Ekip üzvləri', count: () => prisma.teamMember.count() },
  { label: 'Başvurular', count: () => prisma.application.count() },
  { label: '  ↳ oxunmamış', count: () => prisma.application.count({ where: { readAt: null } }) },
  { label: 'Mesajlar', count: () => prisma.message.count() },
  { label: '  ↳ yanıtlanmamış', count: () => prisma.message.count({ where: { adminReply: null } }) },
  { label: 'Hakkımızda (sətir)', count: () => prisma.aboutContent.count() },
  { label: 'Əlaqə (sətir)', count: () => prisma.contactContent.count() },
  { label: 'Ana səhifə mətnləri', count: () => prisma.homePageContent.count() },
  { label: 'E-poçt ayarları', count: () => prisma.emailSettings.count() },
  { label: 'Medya faylları', count: () => prisma.mediaFile.count() },
];

console.log('\n📊 OstWind — Veritabanı statistikası\n');
console.log('─'.repeat(42));

let total = 0;
for (const row of tables) {
  const n = await row.count();
  if (!row.label.startsWith('  ')) total += n;
  console.log(`${row.label.padEnd(28)} ${String(n).padStart(6)}`);
}

console.log('─'.repeat(42));
console.log(`${'Cəmi (əsas cədvəllər)'.padEnd(28)} ${String(total).padStart(6)}`);
console.log('\n💡 Blog taslak = sitede görünməz. Yayında + silinməyib = public /blog\n');

await prisma.$disconnect();
