import { PrismaClient } from '@prisma/client';
import { access } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function diskFromUrl(url) {
  if (!url?.startsWith('/uploads/')) return null;
  const rel = url.replace(/^\//, '').replace(/\\/g, '/');
  if (rel.includes('..')) return null;
  return path.join(process.cwd(), 'public', ...rel.split('/'));
}

const rows = await prisma.onlineAdmission.findMany({
  orderBy: { id: 'desc' },
  take: 5,
});

for (const row of rows) {
  console.log('\n--- Admission', row.id, row.firstName, row.lastName, 'studentUserId', row.studentUserId);
  for (const [k, url] of [
    ['attestat', row.attestatFile],
    ['passport', row.passportFile],
    ['photo', row.photoFile],
    ['summary', row.summaryPdf],
  ]) {
    const disk = diskFromUrl(url);
    const ok = disk ? await exists(disk) : false;
    console.log(`  ${k}: ${url}`);
    console.log(`    disk: ${disk} => ${ok ? 'OK' : 'MISSING'}`);
    if (!ok && disk) {
      const pending = path.join(
        process.cwd(),
        'public',
        'uploads',
        'admissions',
        'pending',
        String(row.studentUserId),
        path.basename(url),
      );
      console.log(`    pending try: ${pending} => ${(await exists(pending)) ? 'OK' : 'MISSING'}`);
    }
  }
}

await prisma.$disconnect();
