import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, email, phone, universityId, message } = body;

    if (!studentName || !email || !phone) {
      return NextResponse.json({ error: 'Eksik alanlar' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        studentName: String(studentName),
        email: String(email),
        phone: String(phone),
        universityId: universityId ? Number(universityId) : null,
        message: message ? String(message) : null,
      },
    });

    const { notifyNewApplication, sendApplicantConfirmation } = await import(
      '@/lib/admin-email'
    );
    await notifyNewApplication(application).catch(() => {});
    await sendApplicantConfirmation(application).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 });
  }
}
