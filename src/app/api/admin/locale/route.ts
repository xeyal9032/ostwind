import { NextResponse } from 'next/server';
import { ADMIN_LOCALE_COOKIE, isAdminLocale } from '@/lib/admin-locale';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const locale = typeof body.locale === 'string' ? body.locale : '';

  if (!isAdminLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(ADMIN_LOCALE_COOKIE, locale, {
    path: '/admin',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return res;
}
