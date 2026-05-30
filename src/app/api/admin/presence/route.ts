import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { touchAdminPresence } from '@/lib/admin-presence';

/** Panel açıq olduqda aktivliyi yeniləyir */
export async function POST() {
  const { session, error } = await requireSession();
  if (error) return error;

  const userId = session?.user?.id ? parseInt(session.user.id, 10) : NaN;
  if (!Number.isNaN(userId)) {
    await touchAdminPresence(userId);
  }

  return NextResponse.json({ ok: true });
}
