import { prisma } from '@/prisma';

const SESSION_DAYS = 30;

export async function createAdminSession(params: {
  userId: number;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  return prisma.adminSession.create({
    data: {
      userId: params.userId,
      ip: params.ip ?? null,
      userAgent: params.userAgent ?? null,
      expiresAt,
    },
  });
}

export async function touchAdminSession(sessionId: string) {
  try {
    await prisma.adminSession.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });
  } catch {
    // sessiya tapılmaya bilər
  }
}

export async function revokeAdminSession(sessionId: string, userId: number) {
  return prisma.adminSession.deleteMany({
    where: { id: sessionId, userId },
  });
}

export async function revokeOtherAdminSessions(userId: number, keepSessionId?: string) {
  return prisma.adminSession.deleteMany({
    where: {
      userId,
      ...(keepSessionId ? { id: { not: keepSessionId } } : {}),
    },
  });
}
