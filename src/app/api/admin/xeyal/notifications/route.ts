import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const [unreadApplications, unreadMessages, recentApplications, recentMessages] =
    await Promise.all([
      prisma.application.count({ where: { readAt: null } }),
      prisma.message.count({ where: { readAt: null } }),
      prisma.application.findMany({
        where: { readAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.message.findMany({
        where: { readAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

  return NextResponse.json({
    unreadApplications,
    unreadMessages,
    recentApplications,
    recentMessages,
  });
}

export async function POST(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();
  const type = body.type as 'applications' | 'messages' | 'all';

  const now = new Date();
  const meta = getRequestMeta(req);

  if (type === 'applications' || type === 'all') {
    await prisma.application.updateMany({
      where: { readAt: null },
      data: { readAt: now },
    });
  }
  if (type === 'messages' || type === 'all') {
    await prisma.message.updateMany({
      where: { readAt: null },
      data: { readAt: now },
    });
  }

  await logAudit({
    session,
    action: 'UPDATE',
    entity: 'notifications',
    summary: `Oxunmuş işarələndi: ${type}`,
    ...meta,
  });

  return NextResponse.json({ success: true });
}
