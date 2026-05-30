import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { DEFAULT_CONTACT } from '@/lib/contact-defaults';
import { getDefaultContactPublic } from '@/lib/contact-content';
import { fillEmptyLocales, sanitizeLocaleJson } from '@/lib/about-defaults';

function toJsonSubtitle(value: unknown): Prisma.InputJsonValue {
  const filled = fillEmptyLocales(
    sanitizeLocaleJson(value),
    { ...DEFAULT_CONTACT.pageSubtitle }
  );
  return filled as Prisma.InputJsonValue;
}

async function getOrCreateContact() {
  let row = await prisma.contactContent.findUnique({ where: { id: 1 } });
  if (!row) {
    row = await prisma.contactContent.create({
      data: {
        id: 1,
        address: DEFAULT_CONTACT.address,
        phone: DEFAULT_CONTACT.phone,
        email: DEFAULT_CONTACT.email,
        mapsUrl: DEFAULT_CONTACT.mapsUrl,
        hoursWeekdays: DEFAULT_CONTACT.hoursWeekdays,
        hoursSaturday: DEFAULT_CONTACT.hoursSaturday,
        sundayClosed: DEFAULT_CONTACT.sundayClosed,
        hoursSunday: DEFAULT_CONTACT.hoursSunday,
        facebookUrl: DEFAULT_CONTACT.facebookUrl,
        instagramUrl: DEFAULT_CONTACT.instagramUrl,
        tiktokUrl: DEFAULT_CONTACT.tiktokUrl,
        pageSubtitle: { ...DEFAULT_CONTACT.pageSubtitle },
      },
    });
  }
  return row;
}

function buildDataFromBody(body: Record<string, unknown>) {
  const sundayClosed = body.sundayClosed === true || body.sundayClosed === 'true';

  return {
    address: String(body.address ?? '').trim() || DEFAULT_CONTACT.address,
    phone: String(body.phone ?? '').trim() || DEFAULT_CONTACT.phone,
    email: String(body.email ?? '').trim() || DEFAULT_CONTACT.email,
    mapsUrl: String(body.mapsUrl ?? '').trim() || DEFAULT_CONTACT.mapsUrl,
    hoursWeekdays:
      String(body.hoursWeekdays ?? '').trim() || DEFAULT_CONTACT.hoursWeekdays,
    hoursSaturday:
      String(body.hoursSaturday ?? '').trim() || DEFAULT_CONTACT.hoursSaturday,
    sundayClosed,
    hoursSunday: sundayClosed
      ? null
      : String(body.hoursSunday ?? '').trim() || null,
    facebookUrl: String(body.facebookUrl ?? '').trim() || DEFAULT_CONTACT.facebookUrl,
    instagramUrl: String(body.instagramUrl ?? '').trim() || DEFAULT_CONTACT.instagramUrl,
    tiktokUrl: String(body.tiktokUrl ?? '').trim() || DEFAULT_CONTACT.tiktokUrl,
    pageSubtitle: toJsonSubtitle(body.pageSubtitle),
  };
}

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return 'Kaydedilemedi';
}

export async function GET() {
  const { error } = await requirePermission('contact');
  if (error) return error;

  try {
    const row = await getOrCreateContact();
    return NextResponse.json({
      ...row,
      pageSubtitle: fillEmptyLocales(row.pageSubtitle, { ...DEFAULT_CONTACT.pageSubtitle }),
    });
  } catch (err) {
    console.error('Contact GET error:', err);
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requirePermission('contact');
  if (error) return error;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = buildDataFromBody(body);

    const existing = await prisma.contactContent.findUnique({ where: { id: 1 } });
    const row = existing
      ? await prisma.contactContent.update({ where: { id: 1 }, data })
      : await prisma.contactContent.create({ data: { id: 1, ...data } });

    return NextResponse.json({
      ...row,
      pageSubtitle: fillEmptyLocales(row.pageSubtitle, { ...DEFAULT_CONTACT.pageSubtitle }),
    });
  } catch (err) {
    console.error('Contact PUT error:', err);
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

/** Varsayılan əlaqə məlumatlarına sıfırla */
export async function DELETE() {
  const { error } = await requirePermission('contact');
  if (error) return error;

  try {
    await prisma.contactContent.deleteMany({ where: { id: 1 } });
    const defaults = getDefaultContactPublic();
    const row = await prisma.contactContent.create({
      data: {
        id: 1,
        address: defaults.address,
        phone: defaults.phone,
        email: defaults.email,
        mapsUrl: defaults.mapsUrl,
        hoursWeekdays: defaults.hoursWeekdays,
        hoursSaturday: defaults.hoursSaturday,
        sundayClosed: defaults.sundayClosed,
        hoursSunday: defaults.hoursSunday,
        facebookUrl: defaults.facebookUrl,
        instagramUrl: defaults.instagramUrl,
        tiktokUrl: defaults.tiktokUrl,
        pageSubtitle: { ...DEFAULT_CONTACT.pageSubtitle },
      },
    });
    return NextResponse.json({
      ...row,
      pageSubtitle: fillEmptyLocales(row.pageSubtitle, { ...DEFAULT_CONTACT.pageSubtitle }),
    });
  } catch (err) {
    console.error('Contact DELETE error:', err);
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
