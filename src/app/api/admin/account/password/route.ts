import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { requireSession } from '@/lib/auth';

export async function PUT(req: Request) {
  const { session, error } = await requireSession();
  if (error) return error;

  const userId = session?.user?.id ? parseInt(session.user.id, 10) : NaN;
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Etibarsız sessiya' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');
    const confirmPassword = String(body.confirmPassword || '');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Bütün şifrə sahələri mütləqdir' },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Yeni şifrə ən azı 6 simvol olmalıdır' },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Yeni şifrə və təsdiq uyğun gəlmir' },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'Yeni şifrə köhnədən fərqli olmalıdır' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'Cari şifrə yanlışdır' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Şifrə dəyişdirilə bilmədi' }, { status: 500 });
  }
}
