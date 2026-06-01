/**
 * Bir və ya bütün onlayn qəbul PDF-lərini yeniləyir.
 * npx tsx scripts/regenerate-admission-summary.ts       → hamısı
 * npx tsx scripts/regenerate-admission-summary.ts 2    → yalnız ID 2
 */
import { PrismaClient } from '@prisma/client';
import {
  regenerateAdmissionSummary,
  regenerateAllAdmissionSummaries,
} from '../src/lib/regenerate-admission-summary';

const prisma = new PrismaClient();
const arg = process.argv[2];

async function main() {
  if (!arg || arg === 'all') {
    const results = await regenerateAllAdmissionSummaries();
    if (results.length === 0) {
      console.log('Heç bir onlayn qəbul qeydi yoxdur.');
      return;
    }
    for (const r of results) {
      console.log(`#${r.id} → ${r.url}`);
    }
    console.log(`\nCəmi: ${results.length} PDF yeniləndi.`);
    return;
  }

  const id = parseInt(arg, 10);
  if (Number.isNaN(id)) {
    console.error('ID və ya "all" daxil edin.');
    process.exit(1);
  }
  const { url } = await regenerateAdmissionSummary(id);
  console.log('OK:', url);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
