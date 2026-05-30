import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity') || undefined;
  const action = searchParams.get('action') || undefined;
  const q = searchParams.get('q')?.trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        ...(entity ? { entity } : {}),
        ...(action ? { action } : {}),
        ...(q
          ? {
              OR: [
                { userEmail: { contains: q } },
                { summary: { contains: q } },
                { entityId: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: 'Audit log yüklənə bilmədi' }, { status: 500 });
  }
}
