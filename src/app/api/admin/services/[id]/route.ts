import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import { softDeleteData } from '@/lib/soft-delete';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('services');
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('services');
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const { slug, title, description, icon } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        slug,
        title,
        description,
        icon,
      },
    });

    await logAudit({
      session,
      action: 'UPDATE',
      entity: 'service',
      entityId: idStr,
      summary: slug,
      ...getRequestMeta(req),
    });

    return NextResponse.json(service);
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('services');
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    await prisma.service.update({
      where: { id },
      data: softDeleteData(),
    });

    await logAudit({
      session,
      action: 'DELETE',
      entity: 'service',
      entityId: idStr,
      summary: 'Zibil qutusuna köçürüldü',
      ...getRequestMeta(req),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
