import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import { softDeleteData } from '@/lib/soft-delete';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('universities');
  if (error) return error;

  try {
    const { id } = await params;
    const university = await prisma.university.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    return NextResponse.json(university);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch university' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('universities');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, name, description, country, city, image, tuitionFee, tuitionFeePartTime } = body;

    const university = await prisma.university.update({
      where: { id: parseInt(id, 10) },
      data: {
        slug,
        name,
        description,
        country,
        city,
        image,
        tuitionFee,
        tuitionFeePartTime: tuitionFeePartTime ?? null,
      },
    });

    await logAudit({
      session,
      action: 'UPDATE',
      entity: 'university',
      entityId: id,
      summary: slug,
      ...getRequestMeta(req),
    });

    return NextResponse.json(university);
  } catch {
    return NextResponse.json({ error: 'Failed to update university' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('universities');
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.university.update({
      where: { id: parseInt(id, 10) },
      data: softDeleteData(),
    });

    await logAudit({
      session,
      action: 'DELETE',
      entity: 'university',
      entityId: id,
      summary: 'Zibil qutusuna köçürüldü',
      ...getRequestMeta(req),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
  }
}
