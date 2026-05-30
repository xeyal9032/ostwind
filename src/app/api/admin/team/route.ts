import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { normalizeSocialLinks } from '@/lib/team-social';
import { notDeleted } from '@/lib/soft-delete';

export async function GET() {
  const { error } = await requirePermission('team');
  if (error) return error;

  try {
    const members = await prisma.teamMember.findMany({
      where: notDeleted,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(members);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requirePermission('team');
  if (error) return error;

  try {
    const body = await request.json();
    const { name, role, image, socialLinks } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: 'Name and role are required' }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        image,
        socialLinks: normalizeSocialLinks(socialLinks || {}),
      },
    });

    return NextResponse.json(member);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}
