import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSession, requireSuperAdmin } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, user, error } = await requireSession();
  if (error) return error;

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const asSuper = searchParams.get('all') === '1';

  if (asSuper) {
    const superCheck = await requireSuperAdmin();
    if (superCheck.error) return superCheck.error;
    await prisma.adminSession.delete({ where: { id } });
  } else {
    await prisma.adminSession.deleteMany({
      where: { id, userId: user!.id },
    });
  }

  await logAudit({
    session,
    action: 'SECURITY',
    entity: 'session',
    entityId: id,
    summary: 'Sessiya sonlandırıldı',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}
