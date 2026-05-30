import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/prisma';
import { requireSession } from '@/lib/auth';
import { generateTotpSecret, getTotpUri } from '@/lib/admin-2fa';

export async function POST() {
  const { session, user, error } = await requireSession();
  if (error) return error;

  const secret = generateTotpSecret();
  await prisma.user.update({
    where: { id: user!.id },
    data: { totpSecret: secret, totpEnabled: false },
  });

  const uri = getTotpUri(session!.user!.email!, secret);
  const qrDataUrl = await QRCode.toDataURL(uri, { margin: 2, width: 220 });

  return NextResponse.json({ secret, uri, qrDataUrl });
}
