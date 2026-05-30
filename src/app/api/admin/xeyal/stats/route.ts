import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { isAdminOnline } from '@/lib/admin-presence';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const [
    unreadApplications,
    unreadMessages,
    totalAdmins,
    users,
    recentAudit,
  ] = await Promise.all([
    prisma.application.count({ where: { readAt: null } }),
    prisma.message.count({ where: { readAt: null } }),
    prisma.user.count(),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, lastSeenAt: true, isActive: true },
    }),
    prisma.adminAuditLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const onlineAdmins = users.filter((u) => u.isActive && isAdminOnline(u.lastSeenAt)).length;

  return NextResponse.json({
    unreadApplications,
    unreadMessages,
    totalAdmins,
    onlineAdmins,
    frozenAdmins: users.filter((u) => !u.isActive).length,
    recentAudit,
  });
}
