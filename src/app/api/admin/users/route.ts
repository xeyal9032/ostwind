import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { ADMIN_ROLES, type AdminRole } from '@/lib/admin-roles';
import { formatAdminLastSeen, isAdminOnline } from '@/lib/admin-presence';

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  permissions: true,
  lastSeenAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRole(role: unknown): AdminRole | null {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return role;
  return null;
}

function enrichUsers(
  users: Array<{
    id: number;
    name: string | null;
    email: string;
    role: string;
    lastSeenAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>,
) {
  const enriched = users.map((u) => ({
    ...u,
    isOnline: isAdminOnline(u.lastSeenAt),
    lastSeenLabel: formatAdminLastSeen(u.lastSeenAt),
  }));

  const online = enriched.filter((u) => u.isOnline).length;

  return {
    users: enriched,
    stats: {
      total: enriched.length,
      online,
      offline: enriched.length - online,
    },
  };
}

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const users = await prisma.user.findMany({
      select: userPublicSelect,
      orderBy: [{ role: 'asc' }, { id: 'asc' }],
    });
    return NextResponse.json(enrichUsers(users));
  } catch {
    return NextResponse.json({ error: 'İstifadəçilər yüklənə bilmədi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const password = String(body.password || '');
    const name = body.name ? String(body.name).trim() : null;
    const role = parseRole(body.role) ?? 'ADMIN';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta və şifrə mütləqdir' },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifrə ən azı 6 simvol olmalıdır' },
        { status: 400 },
      );
    }
    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Etibarsız rol' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isActive: true,
      },
      select: userPublicSelect,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu e-posta artıq qeydiyyatdadır' }, { status: 400 });
    }
    return NextResponse.json({ error: 'İstifadəçi yaradıla bilmədi' }, { status: 500 });
  }
}
