import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { softDeleteData } from '@/lib/soft-delete';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('universities');
  if (error) return error;

  const { id } = await params;
  const hub = await prisma.universityHub.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!hub) {
    return NextResponse.json({ error: 'Tapılmadı' }, { status: 404 });
  }

  return NextResponse.json(hub);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('universities');
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { slug, title, subtitle, description, image, flagImage, icon, accentColor, sortOrder, isActive } =
    body;

  try {
    const hub = await prisma.universityHub.update({
      where: { id: parseInt(id, 10) },
      data: {
        slug: slug ? String(slug).trim().toLowerCase() : undefined,
        title,
        subtitle: subtitle ?? null,
        description: description ?? null,
        image: image ?? null,
        flagImage: flagImage ?? null,
        icon: icon ?? null,
        accentColor: accentColor || 'blue',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : undefined,
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
      },
    });
    return NextResponse.json(hub);
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug artıq mövcuddur' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Yenilənmədi' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('universities');
  if (error) return error;

  const { id } = await params;
  await prisma.universityHub.update({
    where: { id: parseInt(id, 10) },
    data: softDeleteData(),
  });

  return NextResponse.json({ success: true });
}
