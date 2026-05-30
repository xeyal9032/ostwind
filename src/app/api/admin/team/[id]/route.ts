import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import { normalizeSocialLinks } from '@/lib/team-social';
import { softDeleteData } from '@/lib/soft-delete';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('team');
  if (error) return error;

  try {
    const { id } = await params;
    const member = await prisma.teamMember.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('team');
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role, image, socialLinks } = body;

    const member = await prisma.teamMember.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        role,
        image,
        socialLinks: normalizeSocialLinks(socialLinks || {}),
      },
    });

    await logAudit({
      session,
      action: 'UPDATE',
      entity: 'team',
      entityId: id,
      summary: name,
      ...getRequestMeta(request),
    });

    return NextResponse.json(member);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('team');
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.teamMember.update({
      where: { id: parseInt(id, 10) },
      data: softDeleteData(),
    });

    await logAudit({
      session,
      action: 'DELETE',
      entity: 'team',
      entityId: id,
      summary: 'Zibil qutusuna köçürüldü',
      ...getRequestMeta(request),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}
