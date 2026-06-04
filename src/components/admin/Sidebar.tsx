'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isSuperAdmin } from '@/lib/admin-roles';
import { hasPermission, type PermissionKey } from '@/lib/admin-permissions';
import AdminBrandLogo from '@/components/admin/AdminBrandLogo';

type MenuKey =
  | 'dashboard'
  | 'universities'
  | 'universityHubs'
  | 'services'
  | 'pricing'
  | 'faq'
  | 'blog'
  | 'blogCategories'
  | 'applications'
  | 'onlineAdmissions'
  | 'messages'
  | 'contact'
  | 'team'
  | 'about'
  | 'account'
  | 'users';

type MenuItem = {
  key: MenuKey;
  href: string;
  icon: string;
  permission?: PermissionKey;
};

const ALL_MENU: MenuItem[] = [
  { key: 'dashboard', href: '/admin/dashboard', icon: '📊' },
  { key: 'universities', href: '/admin/universities', icon: '🎓', permission: 'universities' },
  { key: 'universityHubs', href: '/admin/university-hubs', icon: '🌍', permission: 'universities' },
  { key: 'services', href: '/admin/services', icon: '🛠️', permission: 'services' },
  { key: 'pricing', href: '/admin/pricing', icon: '💰', permission: 'pricing' },
  { key: 'faq', href: '/admin/faq', icon: '❓', permission: 'faq' },
  { key: 'blog', href: '/admin/blog', icon: '📰', permission: 'blog' },
  { key: 'blogCategories', href: '/admin/blog/categories', icon: '🏷️', permission: 'blog' },
  { key: 'applications', href: '/admin/applications', icon: '📝', permission: 'applications' },
  { key: 'onlineAdmissions', href: '/admin/online-admissions', icon: '📋', permission: 'onlineAdmissions' },
  { key: 'messages', href: '/admin/messages', icon: '✉️', permission: 'messages' },
  { key: 'contact', href: '/admin/contact', icon: '📞', permission: 'contact' },
  { key: 'team', href: '/admin/team', icon: '👥', permission: 'team' },
  { key: 'about', href: '/admin/about', icon: '📖', permission: 'about' },
  { key: 'account', href: '/admin/account', icon: '🔑' },
];

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const tMenu = useTranslations('menu');
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

  const extraItems: MenuItem[] = isSuperAdmin(role)
    ? [{ key: 'users', href: '/admin/users', icon: '🔐' }]
    : [];

  return (
    <div className="w-full h-full min-h-screen lg:w-64 bg-zinc-900 text-white flex flex-col shadow-xl lg:shadow-none">
      <div className="p-6 flex justify-center">
        <AdminBrandLogo size={64} />
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-none">
        {[...menuItems, ...extraItems].map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center min-h-[44px] px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {tMenu(item.key)}
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
          {tMenu('logout')}
        </button>
      </div>
    </div>
  );
}
