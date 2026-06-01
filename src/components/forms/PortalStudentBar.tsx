'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function PortalStudentBar({
  student,
}: {
  student: { firstName: string; lastName: string; email: string };
}) {
  const t = useTranslations('StudentAuth');
  const router = useRouter();

  async function logout() {
    await fetch('/api/student/logout', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-gray-600 dark:text-gray-400">
        {student.firstName} {student.lastName} · {student.email}
      </span>
      <button
        type="button"
        onClick={logout}
        className="text-red-600 hover:underline dark:text-red-400"
      >
        {t('logout')}
      </button>
    </div>
  );
}
