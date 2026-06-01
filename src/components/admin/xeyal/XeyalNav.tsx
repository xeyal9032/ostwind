'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function XeyalNav() {
  const pathname = usePathname();
  const t = useTranslations('xeyal');

  const links = [
    { href: '/admin/xeyal', label: t('navSummary'), exact: true },
    { href: '/admin/xeyal/audit-log', label: t('audit') },
    { href: '/admin/xeyal/notifications', label: t('notificationsTitle') },
    { href: '/admin/xeyal/inbox', label: t('inbox') },
    { href: '/admin/xeyal/roles', label: t('rolesTitle') },
    { href: '/admin/xeyal/security', label: t('securityTitle') },
    { href: '/admin/xeyal/admins', label: t('admins') },
    { href: '/admin/xeyal/homepage', label: t('homepageTitle') },
    { href: '/admin/xeyal/media', label: t('mediaTitle') },
    { href: '/admin/xeyal/seo', label: t('seoTitle') },
    { href: '/admin/xeyal/trash', label: t('trash') },
    { href: '/admin/xeyal/email', label: t('emailTitle') },
  ];

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
