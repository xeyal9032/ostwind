import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { prisma } from '@/prisma';
import { getLocaleText } from '@/lib/locale-content';
import { logAudit } from '@/lib/audit-log';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, user } = await requirePermission('onlineAdmissions');
  if (error) return error;

  const { id } = await params;
  const admissionId = parseInt(id, 10);
  if (Number.isNaN(admissionId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const row = await prisma.onlineAdmission.findUnique({
    where: { id: admissionId },
    include: {
      university: true,
      studentUser: { select: { email: true, createdAt: true } },
    },
  });

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!row.readAt) {
    await prisma.onlineAdmission.update({
      where: { id: admissionId },
      data: { readAt: new Date() },
    });
  }

  return NextResponse.json({
    ...row,
    universityName: getLocaleText(row.university.name, 'az'),
    birthDate: row.birthDate.toISOString(),
    foreignPassportIssueDate: row.foreignPassportIssueDate.toISOString(),
    foreignPassportExpiryDate: row.foreignPassportExpiryDate.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, user } = await requirePermission('onlineAdmissions');
  if (error) return error;

  const { id } = await params;
  const admissionId = parseInt(id, 10);
  const body = await req.json();
  const { status } = body;

  const updated = await prisma.onlineAdmission.update({
    where: { id: admissionId },
    data: { status: status || undefined },
  });

  await logAudit({
    userId: user!.id,
    userEmail: user!.email,
    userName: user!.name,
    action: 'UPDATE',
    entity: 'onlineAdmission',
    entityId: String(admissionId),
    summary: `Status: ${updated.status}`,
  }).catch(() => {});

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, user } = await requirePermission('onlineAdmissions');
  if (error) return error;

  const { id } = await params;
  const admissionId = parseInt(id, 10);

  await prisma.onlineAdmission.delete({ where: { id: admissionId } });

  await logAudit({
    userId: user!.id,
    userEmail: user!.email,
    userName: user!.name,
    action: 'DELETE',
    entity: 'onlineAdmission',
    entityId: String(admissionId),
    summary: 'Onlayn qəbul silindi',
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
