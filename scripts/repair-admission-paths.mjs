/**
 * DB-də pending yolları qalan, fayllar isə admissions/{id}/ qovluğunda olanda düzəldir.
 * İstifadə: node scripts/repair-admission-paths.mjs
 */
import { PrismaClient } from '@prisma/client';
import { access, readdir } from 'fs/promises';
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
  return path.join(process.cwd(), 'public', ...rel.split('/'));
}

async function findInAdmissionDir(admissionId, prefix) {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'admissions', String(admissionId));
  try {
    const files = await readdir(dir);
    const match = files.find((f) => f.startsWith(`${prefix}-`));
    if (match) return `/uploads/admissions/${admissionId}/${match}`;
  } catch {
    /* */
  }
  return null;
}

async function resolveField(row, field) {
  const key = `${field}File`;
  const current = row[key];
  const diskCurrent = current ? diskFromUrl(current) : null;
  if (diskCurrent && (await exists(diskCurrent))) return current;

  const base = current ? path.basename(current) : null;
  const prefixes = { attestat: 'attestat', passport: 'passport', photo: 'photo' };

  const tries = [];
  if (base) {
    tries.push(`/uploads/admissions/${row.id}/${base}`);
    tries.push(`/uploads/admissions/pending/${row.studentUserId}/${base}`);
  }
  const byPrefix = await findInAdmissionDir(row.id, prefixes[field]);
  if (byPrefix) tries.push(byPrefix);

  for (const url of tries) {
    const d = diskFromUrl(url);
    if (d && (await exists(d))) return url;
  }
  return null;
}

const rows = await prisma.onlineAdmission.findMany();
let fixed = 0;

for (const row of rows) {
  const data = {};
  for (const field of ['attestat', 'passport', 'photo']) {
    const resolved = await resolveField(row, field);
    const key = `${field}File`;
    if (resolved && resolved !== row[key]) {
      data[key] = resolved;
    }
  }

  if (Object.keys(data).length > 0) {
    await prisma.onlineAdmission.update({ where: { id: row.id }, data });
    console.log(`Fixed admission #${row.id}:`, data);
    fixed++;
  }
}

console.log(`Done. ${fixed} record(s) updated.`);

await prisma.$disconnect();
