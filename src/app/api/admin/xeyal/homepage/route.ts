import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

const DEFAULT_HOME_KEYS = [
  'heroTitle1',
  'heroTitleHighlight',
  'heroDescription',
  'heroApplyNow',
  'heroExplore',
] as const;

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  let row = await prisma.homePageContent.findUnique({ where: { id: 1 } });
  if (!row) {
    row = await prisma.homePageContent.create({
      data: { id: 1, content: {} },
    });
  }

  return NextResponse.json({ content: row.content, keys: DEFAULT_HOME_KEYS });
}

export async function PUT(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { content } = await req.json();
  if (!content || typeof content !== 'object') {
    return NextResponse.json({ error: 'Etibarsız məzmun' }, { status: 400 });
  }

  const row = await prisma.homePageContent.upsert({
    where: { id: 1 },
    create: { id: 1, content },
    update: { content },
  });

  await logAudit({
    session,
    action: 'UPDATE',
    entity: 'homepage',
    summary: 'Ana səhifə mətnləri yeniləndi',
    ...getRequestMeta(req),
  });

  return NextResponse.json(row);
}
