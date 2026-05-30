import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAdminRole, isSuperAdmin } from '@/lib/admin-roles';
import { touchAdminPresence } from '@/lib/admin-presence';
import { touchAdminSession } from '@/lib/admin-sessions';
import { hasPermission, type PermissionKey } from '@/lib/admin-permissions';
import { prisma } from '@/prisma';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      session: null,
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  if (!isAdminRole(session.user?.role)) {
    return {
      session: null,
      user: null,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  const userId = session.user?.id ? parseInt(session.user.id, 10) : NaN;
  if (Number.isNaN(userId)) {
    return {
      session: null,
      user: null,
      error: NextResponse.json({ error: 'Invalid session' }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) {
    return {
      session: null,
      user: null,
      error: NextResponse.json(
        { error: 'Hesab deaktiv edilib və ya tapılmadı' },
        { status: 403 },
      ),
    };
  }

  await touchAdminPresence(userId);

  const sessionId = (session as { adminSessionId?: string }).adminSessionId;
  if (sessionId) {
    await touchAdminSession(sessionId);
  }

  return { session, user, error: null };
}

export async function requireSuperAdmin() {
  const { session, user, error } = await requireSession();
  if (error) return { session: null, user: null, error };
  if (!isSuperAdmin(session?.user?.role)) {
    return {
      session: null,
      user: null,
      error: NextResponse.json(
        { error: 'Bu əməliyyat yalnız super admin üçündür' },
        { status: 403 },
      ),
    };
  }
  return { session, user, error: null };
}

export async function requirePermission(permission: PermissionKey) {
  const { session, user, error } = await requireSession();
  if (error) return { session: null, user: null, error };

  if (!hasPermission(user!.role, user!.permissions, permission)) {
    return {
      session: null,
      user: null,
      error: NextResponse.json({ error: 'Bu modul üçün icazəniz yoxdur' }, { status: 403 }),
    };
  }

  return { session, user, error: null };
}
