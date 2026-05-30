import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { parsePermissions, PERMISSION_KEYS } from '@/lib/admin-permissions';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Etibarsız ID' }, { status: 400 });
  }

  const body = await req.json();
  const permissions =
    body.permissions === null ? null : parsePermissions(body.permissions);
  const isActive = body.isActive !== undefined ? Boolean(body.isActive) : undefined;

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
  }

  if (target.role === 'SUPER_ADMIN' && isActive === false) {
    return NextResponse.json(
      { error: 'Super admin deaktiv edilə bilməz' },
      { status: 400 },
    );
  }

  const permissionData =
    permissions === undefined
      ? {}
      : {
          permissions:
            permissions === null ? Prisma.JsonNull : permissions,
        };

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...permissionData,
      ...(isActive !== undefined ? { isActive } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      permissions: true,
    },
  });

  await logAudit({
    session,
    action: 'UPDATE',
    entity: 'user',
    entityId: userId,
    summary: `İzinlər/yeniləmə: ${target.email}`,
    metadata: { permissions, isActive },
    ...getRequestMeta(req),
  });

  return NextResponse.json({
    ...user,
    permissions: user.permissions,
    allPermissionKeys: PERMISSION_KEYS,
  });
}
