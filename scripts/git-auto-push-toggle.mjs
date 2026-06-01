/**
 * Avtomatik push-u aç/bağla (.git-auto-push lokal faylı)
 */
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const flag = join(dirname(fileURLToPath(import.meta.url)), '..', '.git-auto-push');
const mode = process.argv[2];

if (mode === 'on') {
  writeFileSync(flag, 'enabled\n', 'utf8');
  console.log('✓ Avtomatik GitHub push AÇIQ.');
  console.log('  Hər git commit-dən sonra origin-ə push olunacaq.');
  console.log('  Hook quraşdırılmayıbsa: npm run git:hooks:install');
} else if (mode === 'off') {
  if (existsSync(flag)) unlinkSync(flag);
  console.log('✓ Avtomatik GitHub push BAĞLI.');
} else {
  const on = existsSync(flag);
  console.log(on ? 'Status: AÇIQ' : 'Status: BAĞLI');
  console.log('  npm run git:auto-push:on  |  npm run git:auto-push:off');
  process.exit(on ? 0 : 1);
}
