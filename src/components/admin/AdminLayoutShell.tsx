'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

type Props = {
  children: React.ReactNode;
};

/** Admin: mobil drawer + desktop sabit sidebar */
export default function AdminLayoutShell({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div className="flex h-[100dvh] min-h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobil drawer */}
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Menünü bağla"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] transform transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setMenuOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopBar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />
        <main className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
