import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { DEFAULT_SERVICES } from '@/lib/services-defaults';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    for (const service of DEFAULT_SERVICES) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: {
          title: service.title,
          description: service.description,
          icon: service.icon,
        },
        create: {
          slug: service.slug,
          title: service.title,
          description: service.description,
          icon: service.icon,
        },
      });
    }
    return NextResponse.json({
      success: true,
      message: 'Standart xidmətlər uğurla yeniləndi.',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' });
  }
}
