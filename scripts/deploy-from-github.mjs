/**
 * GitHub-dan son versiyanı çəkir, build edir (production server).
 * Admin panel: Xeyal → Yeniləmələr
 *
 * Tələb: DEPLOY_ENABLED=true (server .env)
 */
import { execSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOCK = join(ROOT, '.deploy-lock');
const BRANCH = process.env.DEPLOY_BRANCH?.trim() || 'main';
const LOG_DIR = join(ROOT, 'logs');
const STATUS = join(ROOT, '.deploy-status.json');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  return line;
}

function run(cmd, opts = {}) {
  log(`$ ${cmd}`);
  return execSync(cmd, {
    cwd: ROOT,
    stdio: 'inherit',
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'production' },
    ...opts,
  });
}

function saveStatus(success, commit, message, logTail) {
  writeFileSync(
    STATUS,
    JSON.stringify(
      {
        at: new Date().toISOString(),
        commit: commit || '',
        success,
        message,
        logTail: logTail?.slice(-4000),
      },
      null,
      2,
    ),
    'utf8',
  );
}

if (process.env.DEPLOY_ENABLED !== 'true') {
  console.error('DEPLOY_ENABLED=true deyil — deploy dayandırıldı.');
  process.exit(1);
}

if (existsSync(LOCK)) {
  const age = Date.now() - Number(readFileSync(LOCK, 'utf8'));
  if (age < 20 * 60 * 1000) {
    console.error('Deploy artıq işləyir (.deploy-lock).');
    process.exit(1);
  }
  unlinkSync(LOCK);
}

writeFileSync(LOCK, String(Date.now()), 'utf8');
mkdirSync(LOG_DIR, { recursive: true });

let commitBefore = '';
try {
  commitBefore = execSync('git rev-parse --short HEAD', {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
} catch {
  commitBefore = '?';
}

const lines = [];

try {
  lines.push(log('Git fetch...'));
  run(`git fetch origin ${BRANCH}`);

  lines.push(log(`Git pull origin ${BRANCH}...`));
  run(`git pull origin ${BRANCH}`);

  const commitAfter = execSync('git rev-parse --short HEAD', {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();

  lines.push(log('npm ci...'));
  const npmCi = spawnSync('npm', ['ci'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
  if (npmCi.status !== 0) throw new Error('npm ci uğursuz');

  lines.push(log('prisma generate...'));
  run('npx prisma generate');

  lines.push(log('npm run build...'));
  const build = spawnSync('npm', ['run', 'build'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  if (build.status !== 0) throw new Error('npm run build uğursuz');

  const msg = `Deploy uğurlu: ${commitBefore} → ${commitAfter}`;
  lines.push(log(msg));
  lines.push(
    log('Qeyd: cPanel Node.js app-i yenidən başladın (Restart) — yeni build tətbiq olunsun.'),
  );

  saveStatus(true, commitAfter, msg, lines.join('\n'));
  process.exit(0);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  lines.push(log(`XƏTA: ${message}`));
  saveStatus(false, commitBefore, message, lines.join('\n'));
  process.exit(1);
} finally {
  try {
    unlinkSync(LOCK);
  } catch {
    /* */
  }
}
