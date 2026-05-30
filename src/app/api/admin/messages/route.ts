import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const { error } = await requirePermission('messages');
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get('unread') === '1';
  const q = searchParams.get('q')?.trim();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: Prisma.MessageWhereInput = {};

  if (unreadOnly) where.readAt = null;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { subject: { contains: q } },
      { message: { contains: q } },
    ];
  }

  try {
    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Liste alınamadı' }, { status: 500 });
  }
}
