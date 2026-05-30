'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { isAdminRole } from '@/lib/admin-roles';

/** Panel səhifələrində adminin onlayn statusunu yeniləyir */
export default function AdminPresenceHeartbeat() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' || !isAdminRole(session?.user?.role)) return;

    const ping = () => {
      fetch('/api/admin/presence', { method: 'POST' }).catch(() => {});
    };

    ping();
    const interval = setInterval(ping, 60_000);
    return () => clearInterval(interval);
  }, [session?.user?.role, status]);

  return null;
}
