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

  const { error } = await requirePermission('faq');

  if (error) return error;

  try {

    const { id } = await params;

    const item = await prisma.fAQ.findUnique({ where: { id: parseInt(id, 10) } });

    if (!item) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });

    return NextResponse.json(item);

  } catch {

    return NextResponse.json({ error: 'Hata' }, { status: 500 });

  }

}



export async function PUT(

  req: Request,

  { params }: { params: Promise<{ id: string }> },

) {

  const { session, error } = await requirePermission('faq');

  if (error) return error;

  try {

    const { id } = await params;

    const body = await req.json();

    const item = await prisma.fAQ.update({

      where: { id: parseInt(id, 10) },

      data: {

        question: sanitizeLocaleJson(body.question),

        answer: sanitizeLocaleJson(body.answer),

        category: body.category || null,

      },

    });

    await logAudit({

      session,

      action: 'UPDATE',

      entity: 'faq',

      entityId: id,

      ...getRequestMeta(req),

    });

    return NextResponse.json(item);

  } catch {

    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });

  }

}



export async function DELETE(

  req: Request,

  { params }: { params: Promise<{ id: string }> },

) {

  const { session, error } = await requirePermission('faq');

  if (error) return error;

  try {

    const { id } = await params;

    await prisma.fAQ.update({

      where: { id: parseInt(id, 10) },

      data: softDeleteData(),

    });

    await logAudit({

      session,

      action: 'DELETE',

      entity: 'faq',

      entityId: id,

      summary: 'Zibil qutusuna köçürüldü',

      ...getRequestMeta(req),

    });

    return NextResponse.json({ success: true });

  } catch {

    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });

  }

}

