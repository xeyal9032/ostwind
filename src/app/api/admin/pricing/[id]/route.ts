import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

import { requirePermission } from '@/lib/auth';

import { logAudit, getRequestMeta } from '@/lib/audit-log';

import { sanitizeLocaleJson } from '@/lib/locale-content';

import { softDeleteData } from '@/lib/soft-delete';



export async function GET(

  _req: Request,

  { params }: { params: Promise<{ id: string }> },

) {

  const { error } = await requirePermission('pricing');

  if (error) return error;

  try {

    const { id } = await params;

    const plan = await prisma.pricingPlan.findUnique({ where: { id: parseInt(id, 10) } });

    if (!plan) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });

    return NextResponse.json(plan);

  } catch {

    return NextResponse.json({ error: 'Hata' }, { status: 500 });

  }

}



export async function PUT(

  req: Request,

  { params }: { params: Promise<{ id: string }> },

) {

  const { session, error } = await requirePermission('pricing');

  if (error) return error;

  try {

    const { id } = await params;

    const body = await req.json();

    const plan = await prisma.pricingPlan.update({

      where: { id: parseInt(id, 10) },

      data: {

        name: sanitizeLocaleJson(body.name),

        price: String(body.price),

        isPopular: Boolean(body.isPopular),

        features: sanitizeLocaleJson(body.features),

      },

    });

    await logAudit({

      session,

      action: 'UPDATE',

      entity: 'pricing',

      entityId: id,

      ...getRequestMeta(req),

    });

    return NextResponse.json(plan);

  } catch {

    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });

  }

}



export async function DELETE(

  req: Request,

  { params }: { params: Promise<{ id: string }> },

) {

  const { session, error } = await requirePermission('pricing');

  if (error) return error;

  try {

    const { id } = await params;

    await prisma.pricingPlan.update({

      where: { id: parseInt(id, 10) },

      data: softDeleteData(),

    });

    await logAudit({

      session,

      action: 'DELETE',

      entity: 'pricing',

      entityId: id,

      summary: 'Zibil qutusuna köçürüldü',

      ...getRequestMeta(req),

    });

    return NextResponse.json({ success: true });

  } catch {

    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });

  }

}

