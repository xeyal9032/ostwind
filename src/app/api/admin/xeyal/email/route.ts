import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { getEmailSettings } from '@/lib/admin-email';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const settings = await getEmailSettings();
  const { smtpPass: _, ...safe } = settings;
  return NextResponse.json(safe);
}

export async function PUT(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();

  const settings = await prisma.emailSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...body },
    update: {
      enabled: Boolean(body.enabled),
      smtpHost: body.smtpHost ?? null,
      smtpPort: body.smtpPort ? Number(body.smtpPort) : 587,
      smtpSecure: Boolean(body.smtpSecure),
      smtpUser: body.smtpUser ?? null,
      ...(body.smtpPass ? { smtpPass: body.smtpPass } : {}),
      fromEmail: body.fromEmail ?? null,
      notifyAdminOnApplication: Boolean(body.notifyAdminOnApplication),
      adminNotifyEmail: body.adminNotifyEmail ?? null,
      notifyAdminOnMessage: Boolean(body.notifyAdminOnMessage),
      sendApplicantConfirmation: Boolean(body.sendApplicantConfirmation),
      applicantEmailSubject: body.applicantEmailSubject ?? null,
      applicantEmailBody: body.applicantEmailBody ?? null,
    },
  });

  await logAudit({
    session,
    action: 'SETTINGS',
    entity: 'email',
    summary: 'E-posta ayarları yeniləndi',
    ...getRequestMeta(req),
  });

  const { smtpPass: __, ...safe } = settings;
  return NextResponse.json(safe);
}
