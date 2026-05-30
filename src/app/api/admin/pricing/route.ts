import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

import { requirePermission } from '@/lib/auth';

import { sanitizeLocaleJson } from '@/lib/locale-content';

import { notDeleted } from '@/lib/soft-delete';



export async function GET() {

  const { error } = await requirePermission('pricing');

  if (error) return error;

  try {

    const plans = await prisma.pricingPlan.findMany({

      where: notDeleted,

      orderBy: { id: 'asc' },

    });

    return NextResponse.json(plans);

  } catch {

    return NextResponse.json({ error: 'Liste alınamadı' }, { status: 500 });

  }

}



export async function POST(req: Request) {

  const { error } = await requirePermission('pricing');

  if (error) return error;

  try {

    const body = await req.json();

    const { name, price, isPopular, features } = body;

    if (!price) {

      return NextResponse.json({ error: 'Fiyat zorunlu' }, { status: 400 });

    }

    const plan = await prisma.pricingPlan.create({

      data: {

        name: sanitizeLocaleJson(name),

        price: String(price),

        isPopular: Boolean(isPopular),

        features: sanitizeLocaleJson(features),

      },

    });

    return NextResponse.json(plan, { status: 201 });

  } catch {

    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 });

  }

}

