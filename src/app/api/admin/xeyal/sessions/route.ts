import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSession, requireSuperAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const { session, user, error } = await requireSession();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === '1';

  if (all) {
    const superCheck = await requireSuperAdmin();
    if (superCheck.error) return superCheck.error;
  }

  const sessions = await prisma.adminSession.findMany({
    where: all ? undefined : { userId: user!.id },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { lastActiveAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(
    sessions.map((s) => ({
      ...s,
      isCurrent: s.id === (session as { adminSessionId?: string }).adminSessionId,
    })),
  );
}
