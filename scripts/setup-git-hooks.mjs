/**
 * Layihə git hook-larını quraşdırır (githooks/ qovluğu).
 * Bir dəfə işlədin: npm run git:hooks:install
 */
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chmodSync, existsSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const hook = join(root, 'githooks', 'post-commit');

if (!existsSync(hook)) {
  console.error('githooks/post-commit tapılmadı.');
  process.exit(1);
}

try {
  chmodSync(hook, 0o755);
} catch {
  /* Windows */
}

execSync('git config core.hooksPath githooks', { cwd: root, stdio: 'inherit' });
console.log('\n✓ Git hook quraşdırıldı (core.hooksPath = githooks)');
console.log('  Avtomatik push üçün: npm run git:auto-push:on');
console.log('  Sonra normal commit edin — push avtomatik gedəcək.\n');
