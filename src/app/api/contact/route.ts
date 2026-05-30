import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Eksik alanlar' }, { status: 400 });
    }

    const msg = await prisma.message.create({
      data: {
        name: String(name),
        email: String(email),
        subject: subject ? String(subject) : null,
        message: String(message),
      },
    });

    const { notifyNewMessage } = await import('@/lib/admin-email');
    await notifyNewMessage(msg).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 });
  }
}
