import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { notDeleted } from '@/lib/soft-delete';

export async function GET() {
  const { error } = await requirePermission('universities');
  if (error) return error;

  const hubs = await prisma.universityHub.findMany({
    where: notDeleted,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: {
      _count: { select: { universities: { where: notDeleted } } },
    },
  });

  return NextResponse.json(hubs);
}

export async function POST(req: Request) {
  const { error } = await requirePermission('universities');
  if (error) return error;

  const body = await req.json();
  const { slug, title, subtitle, description, image, flagImage, icon, accentColor, sortOrder, isActive } =
    body;

  if (!slug || !title) {
    return NextResponse.json({ error: 'slug və title mütləqdir' }, { status: 400 });
  }

  try {
    const hub = await prisma.universityHub.create({
      data: {
        slug: String(slug).trim().toLowerCase(),
        title,
        subtitle: subtitle ?? null,
        description: description ?? null,
        image: image ?? null,
        flagImage: flagImage ?? null,
        icon: icon ?? null,
        accentColor: accentColor || 'blue',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        isActive: isActive !== false,
      },
    });
    return NextResponse.json(hub, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug artıq mövcuddur' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Yaradılmadı' }, { status: 500 });
  }
}
