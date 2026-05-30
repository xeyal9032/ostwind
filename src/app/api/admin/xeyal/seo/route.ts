import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { notDeleted } from '@/lib/soft-delete';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const [posts, services, universities] = await Promise.all([
    prisma.post.findMany({
      where: notDeleted,
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        ogImage: true,
      },
      orderBy: { id: 'desc' },
      take: 100,
    }),
    prisma.service.findMany({
      where: notDeleted,
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        ogImage: true,
      },
      orderBy: { id: 'desc' },
    }),
    prisma.university.findMany({
      where: notDeleted,
      select: {
        id: true,
        slug: true,
        name: true,
        metaTitle: true,
        metaDescription: true,
        ogImage: true,
      },
      orderBy: { id: 'desc' },
      take: 100,
    }),
  ]);

  return NextResponse.json({ posts, services, universities });
}

export async function PUT(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { type, id, metaTitle, metaDescription, ogImage } = await req.json();
  const entityId = parseInt(String(id), 10);

  if (Number.isNaN(entityId)) {
    return NextResponse.json({ error: 'Etibarsız ID' }, { status: 400 });
  }

  const data = {
    metaTitle: metaTitle ?? null,
    metaDescription: metaDescription ?? null,
    ogImage: ogImage ?? null,
  };

  switch (type) {
    case 'post':
      await prisma.post.update({ where: { id: entityId }, data });
      break;
    case 'service':
      await prisma.service.update({ where: { id: entityId }, data });
      break;
    case 'university':
      await prisma.university.update({ where: { id: entityId }, data });
      break;
    default:
      return NextResponse.json({ error: 'Etibarsız tip' }, { status: 400 });
  }

  await logAudit({
    session,
    action: 'UPDATE',
    entity: `seo_${type}`,
    entityId,
    summary: 'SEO yeniləndi',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}
