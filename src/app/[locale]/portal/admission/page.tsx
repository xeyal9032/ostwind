import { redirect } from '@/i18n/routing';
import { getStudentSession } from '@/lib/student-session';
import { prisma } from '@/prisma';
import OnlineAdmissionForm from '@/components/forms/OnlineAdmissionForm';
import PortalStudentBar from '@/components/forms/PortalStudentBar';
import { getTranslations } from 'next-intl/server';
import { formatLocaleDateTime } from '@/lib/format-locale-date';
import {
  APPLICATION_STATUS_KEYS,
  type ApplicationStatus,
} from '@/lib/application-status';

export default async function PortalAdmissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getStudentSession();
  if (!session) {
    redirect({ href: '/auth/login', locale });
  }
  const student = session!.student;

  const existing = await prisma.onlineAdmission.findFirst({
    where: { studentUserId: student.id },
    select: { id: true, status: true, createdAt: true },
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PortalStudentBar student={student} />
      {existing ? (
        <ExistingAdmission
          locale={locale}
          status={existing.status}
          createdAt={existing.createdAt.toISOString()}
        />
      ) : (
        <OnlineAdmissionForm student={student} />
      )}
    </div>
  );
}

async function ExistingAdmission({
  locale,
  status,
  createdAt,
}: {
  locale: string;
  status: string;
  createdAt: string;
}) {
  const t = await getTranslations({ locale, namespace: 'Portal' });
  const tStatus = await getTranslations({ locale, namespace: 'ApplicationStatus' });

  const statusKey = status as ApplicationStatus;
  const statusLabel = APPLICATION_STATUS_KEYS.includes(statusKey)
    ? tStatus(statusKey)
    : status;

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('submittedTitle')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        {t('statusLabel')}: <strong>{statusLabel}</strong>
      </p>
      <p className="text-sm text-gray-500">
        {t('submittedAt')}: {formatLocaleDateTime(createdAt, locale)}
      </p>
    </div>
  );
}
