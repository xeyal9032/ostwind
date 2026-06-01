import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import {
  getLocalGitInfo,
  isDeployEnabled,
  isGitRepo,
  runDeployFromGithub,
  writeDeployStatus,
} from '@/lib/github-updates';

export async function POST(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  if (!isDeployEnabled()) {
    return NextResponse.json(
      {
        error:
          'Serverdə DEPLOY_ENABLED=true təyin edin (.env / cPanel). Local inkişafda deploy söndürülür.',
      },
      { status: 403 },
    );
  }

  if (!isGitRepo()) {
    return NextResponse.json(
      { error: 'Git repo tapılmadı — server application root git ilə klonlanmalıdır.' },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const confirm = (body as { confirm?: boolean }).confirm === true;
  if (!confirm) {
    return NextResponse.json({ error: 'confirm: true göndərin' }, { status: 400 });
  }

  const before = getLocalGitInfo();

  writeDeployStatus({
    at: new Date().toISOString(),
    commit: before?.shortHash || '',
    success: false,
    message: 'Deploy başladı...',
  });

  const result = runDeployFromGithub();

  await logAudit({
    session,
    action: 'SETTINGS',
    entity: 'deploy',
    summary: result.success
      ? 'GitHub-dan deploy uğurlu'
      : 'GitHub deploy uğursuz',
    metadata: { exitCode: result.exitCode },
    ...getRequestMeta(req),
  });

  return NextResponse.json({
    success: result.success,
    exitCode: result.exitCode,
    output: result.output,
    lastDeploy: result.success
      ? undefined
      : { message: 'Log üçün GET /updates yeniləyin' },
  });
}
