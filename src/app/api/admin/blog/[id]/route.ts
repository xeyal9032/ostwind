import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import { sanitizeLocaleJson } from '@/lib/locale-content';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requirePermission('blog');
  if (error) return error;
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requirePermission('blog');
  if (error) return error;
  try {
    const { id } = await params;
    const body = await req.json();
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        slug: body.slug,
        title: sanitizeLocaleJson(body.title),
        content: sanitizeLocaleJson(body.content),
        image: body.image || null,
        published: Boolean(body.published),
        categoryId: body.categoryId ? Number(body.categoryId) : null,
      },
    });
    await logAudit({
      session,
      action: 'UPDATE',
      entity: 'post',
      entityId: id,
      summary: body.slug,
      ...getRequestMeta(req),
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requirePermission('blog');
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    await logAudit({
      session,
      action: 'DELETE',
      entity: 'post',
      entityId: id,
      summary: 'Zibil qutusuna köçürüldü',
      ...getRequestMeta(req),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
