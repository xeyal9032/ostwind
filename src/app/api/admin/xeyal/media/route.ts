import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const files = await prisma.mediaFile.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json(files);
}

export async function DELETE(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '', 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID tələb olunur' }, { status: 400 });
  }

  const file = await prisma.mediaFile.findUnique({ where: { id } });
  if (!file) {
    return NextResponse.json({ error: 'Fayl tapılmadı' }, { status: 404 });
  }

  const diskPath = path.join(process.cwd(), 'public', file.path.replace(/^\//, ''));
  try {
    await unlink(diskPath);
  } catch {
    // diskdə yoxdursa davam et
  }

  await prisma.mediaFile.delete({ where: { id } });

  await logAudit({
    session,
    action: 'DELETE',
    entity: 'media',
    entityId: id,
    summary: file.filename,
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}
