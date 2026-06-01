import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { prisma } from '@/prisma';
import { getLocaleText } from '@/lib/locale-content';

export async function GET() {
  const { error } = await requirePermission('onlineAdmissions');
  if (error) return error;

  const items = await prisma.onlineAdmission.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      university: { select: { name: true } },
      studentUser: { select: { email: true } },
    },
  });

  return NextResponse.json(
    items.map((a) => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      phone: a.phone,
      universityName: getLocaleText(a.university.name, 'az'),
      studyType: a.studyType,
      studyLanguage: a.studyLanguage,
      status: a.status,
      readAt: a.readAt,
      createdAt: a.createdAt,
      studentEmail: a.studentUser.email,
    })),
  );
}
