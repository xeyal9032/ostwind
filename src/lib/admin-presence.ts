import { prisma } from '@/prisma';

/** Bu müddətdən az aktivlik = onlayn sayılır (5 dəqiqə) */
export const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

/** DB-yə yazma tezliyini məhdudlaşdırır (1 dəqiqə) */
const TOUCH_INTERVAL_MS = 60 * 1000;

const lastTouchByUser = new Map<number, number>();

export function isAdminOnline(lastSeenAt: Date | string | null | undefined): boolean {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_THRESHOLD_MS;
}

/** Super admin panelində göstərilən son aktivlik mətni */
export function formatAdminLastSeen(lastSeenAt: Date | string | null | undefined): string {
  if (!lastSeenAt) return 'Heç vaxt onlayn olmayıb';
  if (isAdminOnline(lastSeenAt)) return 'İndi onlayn';

  const date = new Date(lastSeenAt);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return 'Az əvvəl';
  if (minutes < 60) return `${minutes} dəqiqə əvvəl`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat əvvəl`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün əvvəl`;

  return date.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Admin paneldə aktivlik zamanını yeniləyir */
export async function touchAdminPresence(userId: number): Promise<void> {
  const now = Date.now();
  const last = lastTouchByUser.get(userId) ?? 0;
  if (now - last < TOUCH_INTERVAL_MS) return;

  lastTouchByUser.set(userId, now);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() },
    });
  } catch {
    // Sessiya və ya DB xətasında panel işini bloklama
  }
}
