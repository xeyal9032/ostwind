import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';
import { logAudit, getRequestMeta } from '@/lib/audit-log';
import {
  buildDefaultSiteContent,
  getSiteContent,
  normalizeSiteContent,
  saveSiteContent,
  HERO_TEXT_KEYS,
  HEADER_KEYS,
  FOOTER_KEYS,
  type SiteContentV2,
} from '@/lib/site-content';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const content = await getSiteContent();

  return NextResponse.json({
    content,
    heroTextKeys: HERO_TEXT_KEYS,
    headerKeys: HEADER_KEYS,
    footerKeys: FOOTER_KEYS,
  });
}

export async function PUT(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();
  const raw = body.content;
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Etibarsız məzmun' }, { status: 400 });
  }

  const content = normalizeSiteContent(raw);
  content.v = 2;

  content.heroSlides = (content.heroSlides || [])
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean);
  if (content.heroSlides.length === 0) {
    content.heroSlides = buildDefaultSiteContent().heroSlides;
  }

  const row = await saveSiteContent(content);

  await logAudit({
    session,
    action: 'UPDATE',
    entity: 'homepage',
    summary: 'Sayt məzmunu (ana səhifə, menyu, footer) yeniləndi',
    ...getRequestMeta(req),
  });

  return NextResponse.json({ content: row.content as SiteContentV2 });
}
