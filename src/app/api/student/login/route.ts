import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { attachStudentSessionCookie } from '@/lib/student-session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const student = await prisma.studentUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!student || !student.isActive) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const ok = await bcrypt.compare(String(password), student.password);
    if (!ok) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      student: {
        id: student.id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    });

    return attachStudentSessionCookie(response, {
      studentId: student.id,
      email: student.email,
    });
  } catch (err) {
    console.error('[student/login]', err);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
