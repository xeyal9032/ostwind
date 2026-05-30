import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';
import { testSmtpConnection } from '@/lib/admin-email';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function POST(req: Request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  const body = (await req.json().catch(() => ({}))) as {
    to?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPass?: string;
    fromEmail?: string;
    adminNotifyEmail?: string;
  };

  const result = await testSmtpConnection({
    to: body.to,
    overrides: {
      smtpHost: body.smtpHost,
      smtpPort: body.smtpPort != null ? Number(body.smtpPort) : undefined,
      smtpSecure: body.smtpSecure,
      smtpUser: body.smtpUser,
      smtpPass: body.smtpPass || undefined,
      fromEmail: body.fromEmail,
      adminNotifyEmail: body.adminNotifyEmail,
    },
  });

  if (result.ok) {
    await logAudit({
      session,
      action: 'SETTINGS',
      entity: 'email',
      summary: `SMTP test başarılı → ${result.to}`,
      ...getRequestMeta(req),
    });
    return NextResponse.json({
      success: true,
      message: `Test e-postası gönderildi: ${result.to}`,
      to: result.to,
    });
  }

  const stepLabels = {
    config: 'Yapılandırma',
    verify: 'SMTP bağlantısı',
    send: 'E-posta gönderimi',
  } as const;

  return NextResponse.json(
    {
      success: false,
      step: result.step,
      error: result.error,
      message: `${stepLabels[result.step]}: ${result.error}`,
    },
    { status: 400 },
  );
}
