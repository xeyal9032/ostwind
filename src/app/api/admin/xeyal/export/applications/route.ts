import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { toCsv } from '@/lib/csv-export';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const items = await prisma.application.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const rows = items.map((a) => ({
    id: a.id,
    studentName: a.studentName,
    email: a.email,
    phone: a.phone,
    status: a.status,
    universityId: a.universityId ?? '',
    message: a.message ?? '',
    readAt: a.readAt?.toISOString() ?? '',
    createdAt: a.createdAt.toISOString(),
  }));

  await logAudit({
    session,
    action: 'EXPORT',
    entity: 'application',
    summary: `${items.length} başvuru CSV export`,
    ...getRequestMeta(req),
  });

  const csv = toCsv(rows, [
    'id',
    'studentName',
    'email',
    'phone',
    'status',
    'universityId',
    'message',
    'readAt',
    'createdAt',
  ]);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="basvurular-${Date.now()}.csv"`,
    },
  });
}
