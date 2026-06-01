import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { notDeleted } from '@/lib/soft-delete';
import { getLocaleText } from '@/lib/locale-content';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') || 'az';

  const universities = await prisma.university.findMany({
    where: notDeleted,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      tuitionFee: true,
      tuitionFeePartTime: true,
      country: true,
      city: true,
    },
  });

  const list = universities.map((u) => ({
    id: u.id,
    slug: u.slug,
    name: getLocaleText(u.name, locale),
    country: getLocaleText(u.country, locale),
    city: getLocaleText(u.city, locale),
    tuitionFeeFullTime: u.tuitionFee || '',
    tuitionFeePartTime: u.tuitionFeePartTime || u.tuitionFee || '',
  }));

  return NextResponse.json(list);
}
