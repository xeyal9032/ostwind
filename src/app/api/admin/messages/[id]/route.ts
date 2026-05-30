import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import { sendMessageReply } from '@/lib/admin-email';
import { logAudit, getRequestMeta } from '@/lib/audit-log';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requirePermission('messages');
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
    }

    const body = await req.json();
    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Mesaj bulunamadı' }, { status: 404 });
    }

    if (body.markRead === true) {
      const updated = await prisma.message.update({
        where: { id },
        data: { readAt: existing.readAt ?? new Date() },
      });
      return NextResponse.json(updated);
    }

    const replyText = String(body.reply ?? '').trim();
    if (!replyText) {
      return NextResponse.json({ error: 'Yanıt metni gerekli' }, { status: 400 });
    }

    const emailResult = await sendMessageReply({
      to: existing.email,
      name: existing.name,
      subject: existing.subject,
      originalMessage: existing.message,
      reply: replyText,
    });

    const updated = await prisma.message.update({
      where: { id },
      data: {
        adminReply: replyText,
        repliedAt: new Date(),
        repliedByEmail: session?.user?.email ?? null,
        readAt: existing.readAt ?? new Date(),
      },
    });

    await logAudit({
      session,
      action: 'UPDATE',
      entity: 'message',
      entityId: id,
      summary: `Yanıt: ${existing.email}`,
      ...getRequestMeta(req),
    }).catch(() => {});

    return NextResponse.json({
      ...updated,
      emailSent: emailResult.sent,
      emailError: emailResult.sent ? null : emailResult.reason,
    });
  } catch {
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requirePermission('messages');
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.message.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
