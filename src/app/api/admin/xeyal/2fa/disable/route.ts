import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { requireSession } from '@/lib/auth';
import { verifyTotpToken } from '@/lib/admin-2fa';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function POST(req: Request) {
  const { session, user, error } = await requireSession();
  if (error) return error;

  const { password, code } = await req.json();
  if (!password) {
    return NextResponse.json({ error: 'Şifrə tələb olunur' }, { status: 400 });
  }

  const validPass = await bcrypt.compare(String(password), user!.password);
  if (!validPass) {
    return NextResponse.json({ error: 'Şifrə yanlışdır' }, { status: 400 });
  }

  if (user!.totpEnabled && user.totpSecret) {
    if (!code || !(await verifyTotpToken(user.totpSecret, String(code).trim()))) {
      return NextResponse.json({ error: '2FA kodu yanlışdır' }, { status: 400 });
    }
  }

  await prisma.user.update({
    where: { id: user!.id },
    data: { totpEnabled: false, totpSecret: null },
  });

  await logAudit({
    session,
    action: 'SECURITY',
    entity: '2fa',
    summary: '2FA söndürüldü',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}
