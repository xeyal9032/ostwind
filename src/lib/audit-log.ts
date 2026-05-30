import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma';
import type { Session } from 'next-auth';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'RESTORE'
  | 'EXPORT'
  | 'SETTINGS'
  | 'SECURITY';

export async function logAudit(params: {
  session?: Session | null;
  userId?: number;
  userEmail?: string;
  userName?: string | null;
  action: AuditAction | string;
  entity: string;
  entityId?: string | number | null;
  summary?: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}) {
  try {
    const userId =
      params.userId ??
      (params.session?.user?.id ? parseInt(params.session.user.id, 10) : undefined);

    await prisma.adminAuditLog.create({
      data: {
        userId: userId && !Number.isNaN(userId) ? userId : null,
        userEmail: params.userEmail ?? params.session?.user?.email ?? 'system',
        userName: params.userName ?? params.session?.user?.name ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId != null ? String(params.entityId) : null,
        summary: params.summary,
        metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        ip: params.ip ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch {
    // Audit uğursuz olsa əsas əməliyyat dayanmasın
  }
}

type HeaderSource =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined;

function readHeader(headers: HeaderSource, name: string): string | null {
  if (!headers) return null;

  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get(name);
  }

  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[name] ?? record[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return typeof value === 'string' ? value : null;
}

/** Web Request və ya NextAuth/Node IncomingMessage headers */
export function getRequestMeta(
  req: Request | { headers?: HeaderSource } | null | undefined,
) {
  const headers =
    req && typeof req === 'object' && 'headers' in req ? req.headers : undefined;

  const forwarded = readHeader(headers, 'x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || readHeader(headers, 'x-real-ip');
  const userAgent = readHeader(headers, 'user-agent');

  return { ip, userAgent };
}
