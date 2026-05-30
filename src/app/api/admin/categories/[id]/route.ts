import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import { sanitizeLocaleJson } from '@/lib/locale-content';
import { softDeleteData } from '@/lib/soft-delete';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('blog');
  if (error) return error;

  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: 'Yanlış ID' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: 'Tapılmadı' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Xəta' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('blog');
  if (error) return error;

  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: 'Yanlış ID' }, { status: 400 });
    }

    const body = await req.json();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: 'Slug mütləqdir' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        slug,
        name: sanitizeLocaleJson(body.name),
      },
    });

    return NextResponse.json(category);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug artıq mövcuddur' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Yenilənə bilmədi' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('blog');
  if (error) return error;

  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: 'Yanlış ID' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.post.updateMany({
        where: { categoryId },
        data: { categoryId: null },
      }),
      prisma.category.update({
        where: { id: categoryId },
        data: softDeleteData(),
      }),
    ]);

    await logAudit({
      session,
      action: 'DELETE',
      entity: 'category',
      entityId: categoryId,
      summary: 'Zibil qutusuna köçürüldü',
      ...getRequestMeta(req),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinə bilmədi' }, { status: 500 });
  }
}
