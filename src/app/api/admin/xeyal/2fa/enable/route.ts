import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSession } from '@/lib/auth';
import { verifyTotpToken } from '@/lib/admin-2fa';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function POST(req: Request) {
  const { session, user, error } = await requireSession();
  if (error) return error;

  const { code } = await req.json();
  if (!code || !user?.totpSecret) {
    return NextResponse.json({ error: 'Kod tələb olunur' }, { status: 400 });
  }

  if (!(await verifyTotpToken(user.totpSecret, String(code).trim()))) {
    return NextResponse.json({ error: 'Yanlış doğrulama kodu' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { totpEnabled: true },
  });

  await logAudit({
    session,
    action: 'SECURITY',
    entity: '2fa',
    summary: '2FA aktivləşdirildi',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}
