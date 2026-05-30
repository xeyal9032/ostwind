import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const deletedWhere = { deletedAt: { not: null } };

  const [posts, services, universities, faqs, pricing, team, categories] = await Promise.all([
    prisma.post.findMany({
      where: deletedWhere,
      select: { id: true, slug: true, title: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
    prisma.service.findMany({
      where: deletedWhere,
      select: { id: true, slug: true, title: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
    prisma.university.findMany({
      where: deletedWhere,
      select: { id: true, slug: true, name: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
    prisma.fAQ.findMany({
      where: deletedWhere,
      select: { id: true, question: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
    prisma.pricingPlan.findMany({
      where: deletedWhere,
      select: { id: true, name: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
    prisma.teamMember.findMany({
      where: deletedWhere,
      select: { id: true, name: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
    prisma.category.findMany({
      where: deletedWhere,
      select: { id: true, slug: true, name: true, deletedAt: true },
      orderBy: { deletedAt: 'desc' },
      take: 50,
    }),
  ]);

  return NextResponse.json({
    posts: posts.map((p) => ({ ...p, type: 'post' })),
    services: services.map((s) => ({ ...s, type: 'service' })),
    universities: universities.map((u) => ({ ...u, type: 'university' })),
    faqs: faqs.map((f) => ({ ...f, type: 'faq' })),
    pricing: pricing.map((p) => ({ ...p, type: 'pricing' })),
    team: team.map((t) => ({ ...t, type: 'team' })),
    categories: categories.map((c) => ({ ...c, type: 'category' })),
  });
}

export async function POST(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { type, id } = await req.json();
  const entityId = parseInt(String(id), 10);
  if (Number.isNaN(entityId)) {
    return NextResponse.json({ error: 'Etibarsız ID' }, { status: 400 });
  }

  const restore = { deletedAt: null };

  switch (type) {
    case 'post':
      await prisma.post.update({ where: { id: entityId }, data: restore });
      break;
    case 'service':
      await prisma.service.update({ where: { id: entityId }, data: restore });
      break;
    case 'university':
      await prisma.university.update({ where: { id: entityId }, data: restore });
      break;
    case 'faq':
      await prisma.fAQ.update({ where: { id: entityId }, data: restore });
      break;
    case 'pricing':
      await prisma.pricingPlan.update({ where: { id: entityId }, data: restore });
      break;
    case 'team':
      await prisma.teamMember.update({ where: { id: entityId }, data: restore });
      break;
    case 'category':
      await prisma.category.update({ where: { id: entityId }, data: restore });
      break;
    default:
      return NextResponse.json({ error: 'Etibarsız tip' }, { status: 400 });
  }

  await logAudit({
    session,
    action: 'RESTORE',
    entity: String(type),
    entityId,
    summary: 'Zibil qutundan bərpa',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}

async function assertSoftDeleted(
  type: string,
  entityId: number,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const deletedWhere = { id: entityId, deletedAt: { not: null } };

  switch (type) {
    case 'post':
      if (!(await prisma.post.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    case 'service':
      if (!(await prisma.service.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    case 'university':
      if (!(await prisma.university.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    case 'faq':
      if (!(await prisma.fAQ.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    case 'pricing':
      if (!(await prisma.pricingPlan.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    case 'team':
      if (!(await prisma.teamMember.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    case 'category':
      if (!(await prisma.category.findFirst({ where: deletedWhere, select: { id: true } }))) {
        return { ok: false, status: 404, error: 'Kayıt çöp kutusunda bulunamadı' };
      }
      break;
    default:
      return { ok: false, status: 400, error: 'Geçersiz tip' };
  }

  return { ok: true };
}

export async function DELETE(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const { type, id } = await req.json();
  const entityId = parseInt(String(id), 10);
  if (Number.isNaN(entityId)) {
    return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
  }

  const check = await assertSoftDeleted(type, entityId);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    switch (type) {
      case 'post':
        await prisma.post.delete({ where: { id: entityId } });
        break;
      case 'service':
        await prisma.service.delete({ where: { id: entityId } });
        break;
      case 'university':
        await prisma.university.delete({ where: { id: entityId } });
        break;
      case 'faq':
        await prisma.fAQ.delete({ where: { id: entityId } });
        break;
      case 'pricing':
        await prisma.pricingPlan.delete({ where: { id: entityId } });
        break;
      case 'team':
        await prisma.teamMember.delete({ where: { id: entityId } });
        break;
      case 'category':
        await prisma.$transaction([
          prisma.post.updateMany({
            where: { categoryId: entityId },
            data: { categoryId: null },
          }),
          prisma.category.delete({ where: { id: entityId } }),
        ]);
        break;
      default:
        return NextResponse.json({ error: 'Geçersiz tip' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Kalıcı silinemedi' }, { status: 500 });
  }

  await logAudit({
    session,
    action: 'DELETE',
    entity: String(type),
    entityId,
    summary: 'Çöp kutusundan kalıcı silindi',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ success: true });
}
