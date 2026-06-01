import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';
import {
  fetchGithubCommits,
  fetchGithubLatestRelease,
  fetchOrigin,
  getDeployBranch,
  getGithubRepo,
  getIncomingCommits,
  getLocalGitInfo,
  getRemoteAheadBehind,
  isDeployEnabled,
  isGitRepo,
  readDeployLogTail,
  readDeployStatus,
} from '@/lib/github-updates';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const branch = getDeployBranch();
  const repo = getGithubRepo();

  if (isGitRepo()) {
    fetchOrigin();
  }

  const local = getLocalGitInfo();
  const remote = getRemoteAheadBehind(branch);
  const incoming = getIncomingCommits(branch);
  const [githubCommits, latestRelease] = await Promise.all([
    fetchGithubCommits(repo),
    fetchGithubLatestRelease(repo),
  ]);

  return NextResponse.json({
    repo,
    branch,
    deployEnabled: isDeployEnabled(),
    gitAvailable: isGitRepo(),
    local,
    remote: {
      ...remote,
      upToDate: remote.behind === 0 && !local?.dirty,
    },
    incoming,
    github: {
      commits: githubCommits,
      latestRelease,
      repoUrl: `https://github.com/${repo}`,
    },
    lastDeploy: readDeployStatus(),
    deployLogTail: readDeployLogTail(),
  });
}
