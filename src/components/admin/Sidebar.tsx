'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { isSuperAdmin } from '@/lib/admin-roles';
import {
  hasPermission,
  type PermissionKey,
} from '@/lib/admin-permissions';

type MenuItem = {
  name: string;
  href: string;
  icon: string;
  permission?: PermissionKey;
};

const ALL_MENU: MenuItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Üniversiteler', href: '/admin/universities', icon: '🎓', permission: 'universities' },
  { name: 'Hizmetler', href: '/admin/services', icon: '🛠️', permission: 'services' },
  { name: 'Fiyatlandırma', href: '/admin/pricing', icon: '💰', permission: 'pricing' },
  { name: 'SSS', href: '/admin/faq', icon: '❓', permission: 'faq' },
  { name: 'Blog', href: '/admin/blog', icon: '📰', permission: 'blog' },
  { name: 'Blog Kategorileri', href: '/admin/blog/categories', icon: '🏷️', permission: 'blog' },
  { name: 'Başvurular', href: '/admin/applications', icon: '📝', permission: 'applications' },
  { name: 'Mesajlar', href: '/admin/messages', icon: '✉️', permission: 'messages' },
  { name: 'Əlaqə', href: '/admin/contact', icon: '📞', permission: 'contact' },
  { name: 'Ekip', href: '/admin/team', icon: '👥', permission: 'team' },
  { name: 'Hakkımızda', href: '/admin/about', icon: '📖', permission: 'about' },
  { name: 'Hesab / Şifrə', href: '/admin/account', icon: '🔑' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<unknown>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPermissions(data.permissions);
      })
      .finally(() => setLoaded(true));
  }, []);

  const role = session?.user?.role;
  const menuItems = ALL_MENU.filter((item) => {
    if (!item.permission) return true;
    if (!loaded) return true;
    return hasPermission(role, permissions, item.permission);
  });

  const extraItems = isSuperAdmin(role)
    ? [{ name: 'Adminlər', href: '/admin/users', icon: '🔐' }]
    : [];

  return (
    <div className="w-64 bg-zinc-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">OstWind CMS</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {[...menuItems, ...extraItems].map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center w-full px-4 py-3 text-zinc-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <span className="mr-3">🚪</span>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
