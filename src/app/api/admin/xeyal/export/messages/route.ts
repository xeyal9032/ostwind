import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { toCsv } from '@/lib/csv-export';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const items = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });

  const rows = items.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject ?? '',
    message: m.message.replace(/\n/g, ' '),
    readAt: m.readAt?.toISOString() ?? '',
    createdAt: m.createdAt.toISOString(),
  }));

  await logAudit({
    session,
    action: 'EXPORT',
    entity: 'message',
    summary: `${items.length} mesaj CSV export`,
    ...getRequestMeta(req),
  });

  const csv = toCsv(rows, ['id', 'name', 'email', 'subject', 'message', 'readAt', 'createdAt']);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="mesajlar-${Date.now()}.csv"`,
    },
  });
}
