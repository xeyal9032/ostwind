/**
 * ru.json-da az/tr qalmış və ya ingilis qalan admin UI mətnlərini düzəldir.
 * İstifadə: node scripts/sync-admin-ru.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const az = JSON.parse(fs.readFileSync(path.join(root, 'messages/admin/az.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(root, 'messages/admin/en.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(root, 'messages/admin/ru.json'), 'utf8'));
const dict = JSON.parse(fs.readFileSync(path.join(root, 'scripts/admin-en-to-ru.json'), 'utf8'));

const azChars = /[əğıöüşçƏĞİÖŞÜ]/;

function setByPath(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function getByPath(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => o?.[k], obj);
}

const fixes = [];

function walk(a, r, e, prefix = '') {
  for (const key of Object.keys(e)) {
    const np = prefix ? `${prefix}.${key}` : key;
    if (typeof e[key] === 'object' && e[key] !== null) {
      walk(a[key] || {}, r[key] || {}, e[key], np);
      continue;
    }
    const rv = getByPath(ru, np);
    const av = getByPath(az, np);
    const ev = e[key];
    if (typeof rv !== 'string' || typeof ev !== 'string') continue;

    const needsFix =
      azChars.test(rv) || (rv === av && ev !== av) || (dict[ev] && rv !== dict[ev] && rv === ev);

    if (needsFix && dict[ev]) {
      setByPath(ru, np, dict[ev]);
      fixes.push(np);
    } else if (needsFix && azChars.test(rv) && dict[ev]) {
      setByPath(ru, np, dict[ev]);
      fixes.push(np);
    }
  }
}

walk(az, ru, en);

// universities / services / pricing — en ilə eyni ingilis qalan açarlar
for (const ns of ['universities', 'services', 'pricing']) {
  for (const key of Object.keys(en[ns])) {
    const np = `${ns}.${key}`;
    const ev = en[ns][key];
    const rv = getByPath(ru, np);
    if (typeof ev === 'string' && dict[ev] && rv !== dict[ev]) {
      setByPath(ru, np, dict[ev]);
      fixes.push(np);
    }
  }
}

fs.writeFileSync(path.join(root, 'messages/admin/ru.json'), JSON.stringify(ru, null, 2) + '\n', 'utf8');
console.log(`Updated ${fixes.length} keys in messages/admin/ru.json`);
