import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { prisma } from '@/prisma';
import type { EmailSettings } from '@prisma/client';

export async function getEmailSettings() {
  let settings = await prisma.emailSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.emailSettings.create({ data: { id: 1 } });
  }
  return settings;
}

function createTransporter(settings: EmailSettings): Transporter {
  return nodemailer.createTransport({
    host: settings.smtpHost!,
    port: settings.smtpPort ?? 587,
    secure: settings.smtpSecure,
    auth:
      settings.smtpUser && settings.smtpPass
        ? { user: settings.smtpUser, pass: settings.smtpPass }
        : undefined,
  });
}

/** SMTP yapılandırmasının eksiksiz olup olmadığını kontrol eder */
export function validateEmailSettings(settings: EmailSettings): string | null {
  if (!settings.smtpHost?.trim()) return 'SMTP sunucusu gerekli';
  if (!settings.fromEmail?.trim()) return 'Gönderen e-posta gerekli';
  if (!settings.smtpUser?.trim()) return 'SMTP kullanıcı adı gerekli';
  if (!settings.smtpPass?.trim()) return 'SMTP şifre gerekli (kaydedilmiş veya formda)';
  return null;
}

export type SmtpTestResult =
  | { ok: true; to: string; verified: true }
  | { ok: false; step: 'config' | 'verify' | 'send'; error: string };

/** Bağlantı doğrulama + test e-postası gönderimi */
export async function testSmtpConnection(options?: {
  to?: string;
  /** Kaydetmeden önce formdan gelen geçici ayarlar */
  overrides?: Partial<
    Pick<
      EmailSettings,
      | 'smtpHost'
      | 'smtpPort'
      | 'smtpSecure'
      | 'smtpUser'
      | 'smtpPass'
      | 'fromEmail'
      | 'adminNotifyEmail'
    >
  >;
}): Promise<SmtpTestResult> {
  const saved = await getEmailSettings();
  const settings: EmailSettings = {
    ...saved,
    smtpHost: options?.overrides?.smtpHost ?? saved.smtpHost,
    smtpPort: options?.overrides?.smtpPort ?? saved.smtpPort,
    smtpSecure: options?.overrides?.smtpSecure ?? saved.smtpSecure,
    smtpUser: options?.overrides?.smtpUser ?? saved.smtpUser,
    smtpPass: options?.overrides?.smtpPass ?? saved.smtpPass,
    fromEmail: options?.overrides?.fromEmail ?? saved.fromEmail,
    adminNotifyEmail: options?.overrides?.adminNotifyEmail ?? saved.adminNotifyEmail,
  };

  const configError = validateEmailSettings(settings);
  if (configError) {
    return { ok: false, step: 'config', error: configError };
  }

  const transporter = createTransporter(settings);

  try {
    await transporter.verify();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'SMTP bağlantısı doğrulanamadı';
    return { ok: false, step: 'verify', error: message };
  }

  const to = (
    options?.to?.trim() ||
    settings.adminNotifyEmail?.trim() ||
    settings.fromEmail?.trim() ||
    ''
  ).toLowerCase();

  if (!to) {
    return {
      ok: false,
      step: 'send',
      error: 'Test alıcısı yok — admin bildirim veya gönderen e-posta girin',
    };
  }

  try {
    await transporter.sendMail({
      from: settings.fromEmail!,
      to,
      subject: '[OstWind] SMTP test e-postası',
      text: 'Bu mesaj OstWind admin panelinden gönderilen bir SMTP testidir. Bağlantı başarılı.',
      html: '<p>Bu mesaj <strong>OstWind</strong> admin panelinden gönderilen bir SMTP testidir. Bağlantı başarılı.</p>',
    });
    return { ok: true, to, verified: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Test e-postası gönderilemedi';
    return { ok: false, step: 'send', error: message };
  }
}

export async function sendAdminEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const settings = await getEmailSettings();
  if (!settings.enabled) {
    return { sent: false, reason: 'E-posta gönderimi kapalı' };
  }

  const configError = validateEmailSettings(settings);
  if (configError) {
    return { sent: false, reason: configError };
  }

  const transporter = createTransporter(settings);

  try {
    await transporter.sendMail({
      from: settings.fromEmail!,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text.replace(/\n/g, '<br>'),
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gönderim hatası';
    return { sent: false, reason: message };
  }
}

export async function notifyNewApplication(application: {
  studentName: string;
  email: string;
  phone: string;
  message: string | null;
}) {
  const settings = await getEmailSettings();
  if (!settings.enabled || !settings.notifyAdminOnApplication) return;

  const to = settings.adminNotifyEmail || settings.fromEmail;
  if (!to) return;

  await sendAdminEmail({
    to,
    subject: `[OstWind] Yeni başvuru: ${application.studentName}`,
    text: `Yeni başvuru alındı.\n\nAd: ${application.studentName}\nE-posta: ${application.email}\nTelefon: ${application.phone}\n\nMesaj:\n${application.message || '-'}`,
  });
}

export async function notifyNewMessage(msg: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}) {
  const settings = await getEmailSettings();
  if (!settings.enabled || !settings.notifyAdminOnMessage) return;

  const to = settings.adminNotifyEmail || settings.fromEmail;
  if (!to) return;

  await sendAdminEmail({
    to,
    subject: `[OstWind] Yeni mesaj: ${msg.name}`,
    text: `Konu: ${msg.subject || '-'}\nE-posta: ${msg.email}\n\n${msg.message}`,
  });
}

/** İletişim formu mesajına admin yanıtı */
export async function sendMessageReply(params: {
  to: string;
  name: string;
  subject: string | null;
  originalMessage: string;
  reply: string;
}) {
  const subject = params.subject
    ? `Re: ${params.subject} — OstWind Group`
    : 'OstWind Group — Mesajınıza yanıt';

  const text = `Merhaba ${params.name},

Mesajınıza yanıtımız:

${params.reply}

---
Gönderdiğiniz mesaj:
${params.originalMessage}

OstWind Group`;

  return sendAdminEmail({
    to: params.to,
    subject,
    text,
    html: text.replace(/\n/g, '<br>'),
  });
}

export async function sendApplicantConfirmation(
  application: { studentName: string; email: string },
  locale = 'tr',
) {
  const settings = await getEmailSettings();
  if (!settings.enabled || !settings.sendApplicantConfirmation) return;

  const subjectJson = settings.applicantEmailSubject as Record<string, string> | null;
  const bodyJson = settings.applicantEmailBody as Record<string, string> | null;

  const subject =
    subjectJson?.[locale] ||
    subjectJson?.tr ||
    'Başvurunuz alındı — OstWind Group';
  const body =
    bodyJson?.[locale] ||
    bodyJson?.tr ||
    `Merhaba ${application.studentName},\n\nBaşvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.\n\nOstWind Group`;

  await sendAdminEmail({
    to: application.email,
    subject,
    text: body.replace('{name}', application.studentName),
  });
}
