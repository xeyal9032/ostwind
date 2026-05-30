import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { sanitizeLocaleJson } from '@/lib/locale-content';
import { notDeleted } from '@/lib/soft-delete';

export async function GET() {
  const { error } = await requirePermission('blog');
  if (error) return error;
  try {
    const posts = await prisma.post.findMany({
      where: notDeleted,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Liste alınamadı' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requirePermission('blog');
  if (error) return error;
  try {
    const body = await req.json();
    const { slug, image, published, categoryId } = body;
    if (!slug) {
      return NextResponse.json({ error: 'Slug zorunlu' }, { status: 400 });
    }
    const post = await prisma.post.create({
      data: {
        slug,
        title: sanitizeLocaleJson(body.title),
        content: sanitizeLocaleJson(body.content),
        image: image || null,
        published: Boolean(published),
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 });
  }
}
