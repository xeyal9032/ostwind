import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requirePermission('applications');
  if (error) return error;

  try {
    const { id } = await params;
    const { status } = await req.json();
    const allowed = ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'];
    if (!status || !allowed.includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requirePermission('applications');
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.application.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
