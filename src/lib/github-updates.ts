import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DEFAULT_REPO = 'xeyal9032/ostwind';
const DEFAULT_BRANCH = 'main';

export type GitCommitInfo = {
  hash: string;
  shortHash: string;
  subject: string;
  date: string;
  author: string;
};

export type GitHubCommit = {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  author: string;
  url: string;
};

export type DeployStatusFile = {
  at: string;
  commit: string;
  success: boolean;
  message: string;
  logTail?: string;
};

function projectRoot() {
  return process.cwd();
}

function statusPath() {
  return join(projectRoot(), '.deploy-status.json');
}

function logDir() {
  return join(projectRoot(), 'logs');
}

export function getGithubRepo(): string {
  return process.env.GITHUB_REPO?.trim() || DEFAULT_REPO;
}

export function getDeployBranch(): string {
  return process.env.DEPLOY_BRANCH?.trim() || DEFAULT_BRANCH;
}

export function isDeployEnabled(): boolean {
  return process.env.DEPLOY_ENABLED === 'true';
}

export function isGitRepo(): boolean {
  try {
    runGit('rev-parse --is-inside-work-tree');
    return true;
  } catch {
    return false;
  }
}

function runGit(args: string): string {
  return execSync(`git ${args}`, {
    cwd: projectRoot(),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 120_000,
  }).trim();
}

export function readDeployStatus(): DeployStatusFile | null {
  const p = statusPath();
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as DeployStatusFile;
  } catch {
    return null;
  }
}

export function writeDeployStatus(data: DeployStatusFile) {
  writeFileSync(statusPath(), JSON.stringify(data, null, 2), 'utf8');
}

export function getLocalGitInfo(): {
  branch: string;
  commit: string;
  shortHash: string;
  subject: string;
  date: string;
  dirty: boolean;
} | null {
  if (!isGitRepo()) return null;
  try {
    const branch = runGit('rev-parse --abbrev-ref HEAD');
    const commit = runGit('rev-parse HEAD');
    const shortHash = runGit('rev-parse --short HEAD');
    const subject = runGit('log -1 --pretty=%s');
    const date = runGit('log -1 --pretty=%ci');
    const dirty = runGit('status --porcelain').length > 0;
    return { branch, commit, shortHash, subject, date, dirty };
  } catch {
    return null;
  }
}

export function fetchOrigin(): boolean {
  if (!isGitRepo()) return false;
  try {
    runGit('fetch origin --prune');
    return true;
  } catch {
    return false;
  }
}

export function getRemoteAheadBehind(branch: string): {
  behind: number;
  ahead: number;
  remoteCommit: string | null;
  remoteShort: string | null;
} {
  if (!isGitRepo()) {
    return { behind: 0, ahead: 0, remoteCommit: null, remoteShort: null };
  }
  try {
    const remoteRef = `origin/${branch}`;
    runGit(`rev-parse --verify ${remoteRef}`);
    const behind = Number(runGit(`rev-list --count HEAD..${remoteRef}`)) || 0;
    const ahead = Number(runGit(`rev-list --count ${remoteRef}..HEAD`)) || 0;
    const remoteCommit = runGit(`rev-parse ${remoteRef}`);
    const remoteShort = runGit(`rev-parse --short ${remoteRef}`);
    return { behind, ahead, remoteCommit, remoteShort };
  } catch {
    return { behind: 0, ahead: 0, remoteCommit: null, remoteShort: null };
  }
}

export function getIncomingCommits(branch: string, limit = 15): GitCommitInfo[] {
  if (!isGitRepo()) return [];
  try {
    const remoteRef = `origin/${branch}`;
    const raw = runGit(
      `log HEAD..${remoteRef} --pretty=format:%H|%h|%s|%ci|%an -n ${limit}`,
    );
    if (!raw) return [];
    return raw.split('\n').map((line) => {
      const [hash, shortHash, subject, date, author] = line.split('|');
      return { hash, shortHash, subject, date, author };
    });
  } catch {
    return [];
  }
}

export async function fetchGithubCommits(
  repo = getGithubRepo(),
  perPage = 10,
): Promise<GitHubCommit[]> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'OstWind-Admin-Updates',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/repos/${repo}/commits?per_page=${perPage}&sha=${getDeployBranch()}`,
    { headers, next: { revalidate: 60 } },
  );

  if (!res.ok) return [];

  const data = (await res.json()) as Array<{
    sha: string;
    html_url: string;
    commit: { message: string; author: { name?: string; date?: string } };
  }>;

  return data.map((c) => ({
    sha: c.sha,
    shortSha: c.sha.slice(0, 7),
    message: c.commit.message.split('\n')[0] || '',
    date: c.commit.author?.date || '',
    author: c.commit.author?.name || 'GitHub',
    url: c.html_url,
  }));
}

export async function fetchGithubLatestRelease(repo = getGithubRepo()) {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'OstWind-Admin-Updates',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers,
    next: { revalidate: 120 },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    tag_name: string;
    name: string;
    published_at: string;
    html_url: string;
    body: string | null;
  };

  return {
    tag: data.tag_name,
    name: data.name,
    publishedAt: data.published_at,
    url: data.html_url,
    body: data.body || '',
  };
}

/** Serverdə deploy skriptini işə salır */
export function runDeployFromGithub(): {
  success: boolean;
  exitCode: number;
  output: string;
} {
  const script = join(projectRoot(), 'scripts', 'deploy-from-github.mjs');
  if (!existsSync(script)) {
    return { success: false, exitCode: 1, output: 'deploy-from-github.mjs tapılmadı' };
  }

  const result = spawnSync(process.execPath, [script], {
    cwd: projectRoot(),
    encoding: 'utf8',
    timeout: 15 * 60 * 1000,
    env: { ...process.env, NODE_ENV: 'production' },
    maxBuffer: 10 * 1024 * 1024,
  });

  const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
  const success = result.status === 0;

  try {
    mkdirSync(logDir(), { recursive: true });
    writeFileSync(join(logDir(), 'deploy-latest.log'), output, 'utf8');
  } catch {
    /* */
  }

  return {
    success,
    exitCode: result.status ?? 1,
    output: output.slice(-12_000),
  };
}

export function readDeployLogTail(maxChars = 8000): string {
  const p = join(logDir(), 'deploy-latest.log');
  if (!existsSync(p)) return '';
  const full = readFileSync(p, 'utf8');
  return full.length > maxChars ? full.slice(-maxChars) : full;
}
