import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { type AdminRole } from '@/lib/admin-roles';

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  lastSeenAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function parseRole(role: unknown): AdminRole | null {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return role;
  return null;
}

async function countSuperAdmins(excludeId?: number) {
  return prisma.user.count({
    where: {
      role: 'SUPER_ADMIN',
      ...(excludeId != null ? { id: { not: excludeId } } : {}),
    },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Etibarsız ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    });
    if (!user) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Yüklənə bilmədi' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Etibarsız ID' }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
    }

    const body = await req.json();
    const email = body.email
      ? String(body.email).trim().toLowerCase()
      : existing.email;
    const name =
      body.name !== undefined
        ? body.name
          ? String(body.name).trim()
          : null
        : existing.name;
    const newRole = body.role !== undefined ? parseRole(body.role) : null;
    const password = body.password ? String(body.password) : '';

    if (newRole === null && body.role !== undefined) {
      return NextResponse.json({ error: 'Etibarsız rol' }, { status: 400 });
    }

    if (
      existing.role === 'SUPER_ADMIN' &&
      newRole === 'ADMIN' &&
      (await countSuperAdmins(userId)) === 0
    ) {
      return NextResponse.json(
        { error: 'Son super admin silinə və ya dəyişdirilə bilməz' },
        { status: 400 },
      );
    }

    const data: {
      email: string;
      name: string | null;
      role?: string;
      password?: string;
    } = { email, name };

    if (newRole) data.role = newRole;

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Şifrə ən azı 6 simvol olmalıdır' },
          { status: 400 },
        );
      }
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: userPublicSelect,
    });

    return NextResponse.json(user);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu e-posta artıq istifadədədir' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Yenilənə bilmədi' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Etibarsız ID' }, { status: 400 });
  }

  const currentId = session?.user?.id ? parseInt(session.user.id, 10) : NaN;
  if (userId === currentId) {
    return NextResponse.json(
      { error: 'Öz hesabınızı silə bilməzsiniz' },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
    }

    if (existing.role === 'SUPER_ADMIN' && (await countSuperAdmins(userId)) === 0) {
      return NextResponse.json(
        { error: 'Son super admin silinə bilməz' },
        { status: 400 },
      );
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinə bilmədi' }, { status: 500 });
  }
}
