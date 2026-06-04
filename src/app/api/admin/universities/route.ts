import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { notDeleted } from '@/lib/soft-delete';

export async function GET() {
  const { error } = await requirePermission('universities');
  if (error) return error;

  try {
    const universities = await prisma.university.findMany({
      where: notDeleted,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(universities);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requirePermission('universities');
  if (error) return error;

  try {
    const body = await req.json();
    const {
      slug,
      name,
      description,
      country,
      city,
      image,
      tuitionFee,
      tuitionFeePartTime,
      hubId,
    } = body;

    const university = await prisma.university.create({
      data: {
        slug,
        hubId: hubId != null && hubId !== '' ? parseInt(String(hubId), 10) : null,
        name,
        description,
        country,
        city,
        image,
        tuitionFee,
        tuitionFeePartTime: tuitionFeePartTime ?? null,
      },
    });

    return NextResponse.json(university, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 });
  }
}
