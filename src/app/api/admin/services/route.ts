import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { notDeleted } from '@/lib/soft-delete';

export async function GET() {
  const { error } = await requirePermission('services');
  if (error) return error;

  try {
    const services = await prisma.service.findMany({
      where: notDeleted,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requirePermission('services');
  if (error) return error;

  try {
    const body = await req.json();
    const { slug, title, description, icon } = body;

    const service = await prisma.service.create({
      data: {
        slug,
        title,
        description,
        icon,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
