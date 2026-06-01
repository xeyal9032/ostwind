import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma';
import { attachStudentSessionCookie } from '@/lib/student-session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (String(password).length < 6) {
      return NextResponse.json({ error: 'WEAK_PASSWORD' }, { status: 400 });
    }

    const existing = await prisma.studentUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(String(password), 10);
    const student = await prisma.studentUser.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
      },
    });

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
    console.error('[student/register]', err);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
