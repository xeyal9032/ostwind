/**
 * Dəyişiklikləri commit + GitHub push (bir əmr)
 * İstifadə: npm run git:sync -- "commit mesajı"
 */
import { execSync } from 'node:child_process';
import { unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] }).trim();
}

const msgArg = process.argv.slice(2).join(' ').trim();
const defaultMsg = `chore: sinxron ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
const message = msgArg || defaultMsg;

let status = '';
try {
  status = run('git status --porcelain');
} catch {
  console.error('Git tapılmadı və ya repo deyil.');
  process.exit(1);
}

if (!status) {
  console.log('Dəyişiklik yoxdur — commit/push edilmədi.');
  process.exit(0);
}

console.log('Dəyişikliklər:\n', status, '\n');

const msgFile = join(root, '.git-commit-msg.tmp');
try {
  run('git add -A');
  writeFileSync(msgFile, message, 'utf8');
  execSync(`git commit -F "${msgFile}"`, { cwd: root, stdio: 'inherit' });
  unlinkSync(msgFile);
} catch {
  try {
    unlinkSync(msgFile);
  } catch {
    /* */
  }
  console.error('Commit uğursuz (boş və ya hook rədd etdi).');
  process.exit(1);
}

const branch = run('git rev-parse --abbrev-ref HEAD');
console.log(`\n→ Push: origin/${branch}`);

try {
  execSync(`git push origin ${branch}`, { cwd: root, stdio: 'inherit' });
  console.log('\n✓ GitHub sinxron tamamlandı.');
} catch {
  console.error('\n✗ Push uğursuz.');
  process.exit(1);
}
