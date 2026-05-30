import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

import { requirePermission } from '@/lib/auth';

import { sanitizeLocaleJson } from '@/lib/locale-content';

import { notDeleted } from '@/lib/soft-delete';



export async function GET() {

  const { error } = await requirePermission('faq');

  if (error) return error;

  try {

    const items = await prisma.fAQ.findMany({

      where: notDeleted,

      orderBy: { id: 'asc' },

    });

    return NextResponse.json(items);

  } catch {

    return NextResponse.json({ error: 'Liste alınamadı' }, { status: 500 });

  }

}



export async function POST(req: Request) {

  const { error } = await requirePermission('faq');

  if (error) return error;

  try {

    const body = await req.json();

    const item = await prisma.fAQ.create({

      data: {

        question: sanitizeLocaleJson(body.question),

        answer: sanitizeLocaleJson(body.answer),

        category: body.category || null,

      },

    });

    return NextResponse.json(item, { status: 201 });

  } catch {

    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 });

  }

}

