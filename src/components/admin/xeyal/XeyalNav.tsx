'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/xeyal', label: 'Özet', exact: true },
  { href: '/admin/xeyal/audit-log', label: 'Audit Log' },
  { href: '/admin/xeyal/notifications', label: 'Bildirişler' },
  { href: '/admin/xeyal/inbox', label: 'Başvuru & Mesaj' },
  { href: '/admin/xeyal/roles', label: 'Rol & İzinler' },
  { href: '/admin/xeyal/security', label: 'Güvenlik (2FA)' },
  { href: '/admin/xeyal/admins', label: 'Admin Yönetimi' },
  { href: '/admin/xeyal/homepage', label: 'Ana Sayfa Metinleri' },
  { href: '/admin/xeyal/media', label: 'Medya Kütüphanesi' },
  { href: '/admin/xeyal/seo', label: 'SEO' },
  { href: '/admin/xeyal/trash', label: 'Çöp Kutusu' },
  { href: '/admin/xeyal/email', label: 'E-posta Ayarları' },
];

export default function XeyalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-200 dark:border-zinc-800">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
