import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { sanitizeLocaleJson } from '@/lib/locale-content';
import { notDeleted } from '@/lib/soft-delete';

export async function GET() {
  const { error } = await requirePermission('blog');
  if (error) return error;

  try {
    const categories = await prisma.category.findMany({
      where: notDeleted,
      orderBy: { id: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Kateqoriyalar yüklənə bilmədi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requirePermission('blog');
  if (error) return error;

  try {
    const body = await req.json();
    const slug = String(body.slug || '')
      .trim()
      .toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: 'Slug mütləqdir' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        slug,
        name: sanitizeLocaleJson(body.name),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug artıq mövcuddur' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Kateqoriya yaradıla bilmədi' }, { status: 500 });
  }
}
