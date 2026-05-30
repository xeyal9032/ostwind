/**
 * Canlıya çıkmadan önce ortam kontrolü (gizli değerleri yazdırmaz).
 * İstifadə: node scripts/pre-deploy-check.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, '.env');

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const raw = readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = loadEnv();
const checks = [];

const secret = env.NEXTAUTH_SECRET?.trim();
if (!secret) checks.push({ ok: false, msg: 'NEXTAUTH_SECRET eksik' });
else if (secret.length < 32) checks.push({ ok: false, msg: 'NEXTAUTH_SECRET en az 32 karakter olmalı' });
else if (secret.includes('buraya') || secret.includes('ostwind-dev-only'))
  checks.push({ ok: false, msg: 'NEXTAUTH_SECRET zayıf/placeholder — yenileyin' });
else checks.push({ ok: true, msg: 'NEXTAUTH_SECRET tanımlı' });

if (!env.DATABASE_URL?.trim()) checks.push({ ok: false, msg: 'DATABASE_URL eksik' });
else checks.push({ ok: true, msg: 'DATABASE_URL tanımlı' });

if (!env.NEXTAUTH_URL?.trim()) checks.push({ ok: false, msg: 'NEXTAUTH_URL eksik' });
else if (env.NEXTAUTH_URL.includes('localhost'))
  checks.push({ ok: true, msg: 'NEXTAUTH_URL local (canlıda domain ile değiştirin)' });
else checks.push({ ok: true, msg: 'NEXTAUTH_URL tanımlı' });

const nextDir = resolve(root, '.next');
if (!existsSync(nextDir)) checks.push({ ok: false, msg: '.next yok — önce: npm run build' });
else checks.push({ ok: true, msg: '.next build mevcut' });

console.log('\n🔍 Canlıya hazırlık kontrolü\n');
for (const c of checks) {
  console.log(`${c.ok ? '✓' : '✗'} ${c.msg}`);
}
const failed = checks.filter((c) => !c.ok).length;
console.log(failed ? `\n${failed} sorun var.\n` : '\nLocal hazırlık tamam. cPanel için NEXTAUTH_URL ve SMTP ayarlayın.\n');
process.exit(failed ? 1 : 0);
