import { NextResponse } from 'next/server';
import { getStudentSession } from '@/lib/student-session';
import { prisma } from '@/prisma';

export async function GET() {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const admission = await prisma.onlineAdmission.findFirst({
    where: { studentUserId: session.student.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({
    student: session.student,
    admission: admission
      ? { id: admission.id, status: admission.status, createdAt: admission.createdAt }
      : null,
  });
}
