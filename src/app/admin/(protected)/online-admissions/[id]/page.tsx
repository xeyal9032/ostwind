'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { APPLICATION_STATUS_KEYS } from '@/lib/application-status';
import { useApplicationStatusLabel } from '@/components/admin/useApplicationStatusLabel';

type Detail = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  registrationAddress: string;
  foreignPassportNumber: string;
  foreignPassportIssueDate: string;
  foreignPassportExpiryDate: string;
  universityName: string;
  studyType: string;
  studyLanguage: string;
  status: string;
  summaryPdf: string | null;
  attestatFile: string;
  passportFile: string;
  photoFile: string;
  createdAt: string;
};

export default function OnlineAdmissionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('onlineAdmissions');
  const tCommon = useTranslations('common');
  const statusLabel = useApplicationStatusLabel();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);

  useEffect(() => {
    fetch(`/api/admin/online-admissions/${id}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [id]);

  const studyTypeLabel = (type: string) => {
    if (type === 'FULL_TIME') return t('studyFullTime');
    if (type === 'PART_TIME') return t('studyPartTime');
    return type;
  };

  const studyLangLabel = (lang: string) => {
    if (lang === 'EN') return t('langEn');
    if (lang === 'UK') return t('langUk');
    if (lang === 'RU') return t('langRu');
    return lang;
  };

  const regeneratePdf = async () => {
    setPdfBusy(true);
    try {
      const res = await fetch(`/api/admin/online-admissions/${id}/regenerate-summary`, {
        method: 'POST',
      });
      const body = await res.json();
      if (!res.ok) {
        alert(body.error || t('pdfRegenerateFailed'));
        return;
      }
      setData((prev) => (prev ? { ...prev, summaryPdf: body.summaryPdf } : prev));
      setPdfKey((k) => k + 1);
    } finally {
      setPdfBusy(false);
    }
  };

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/admin/online-admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => (prev ? { ...prev, status: updated.status } : prev));
    }
  };

  if (loading) return <p className="text-gray-500">{tCommon('loading')}</p>;
  if (!data?.id) return <p className="text-red-500">{tCommon('notFound')}</p>;

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('az-AZ');

  return (
    <div className="space-y-8 max-w-4xl">
      <Link href="/admin/online-admissions" className="text-sm text-gray-500 hover:underline">
        {t('detailBack')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {data.firstName} {data.lastName}
        </h1>
        <label htmlFor="online-admission-status" className="sr-only">
          {t('statusLabel')}
        </label>
        <select
          id="online-admission-status"
          name="status"
          aria-label={t('statusLabel')}
          value={data.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm bg-white dark:bg-zinc-900"
        >
          {APPLICATION_STATUS_KEYS.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm">
        <Info label={t('birthDate')} value={fmt(data.birthDate)} />
        <Info label="E-poçt" value={data.email} />
        <Info label={t('colPhone')} value={data.phone} />
        <Info label={t('colUniversity')} value={data.universityName} />
        <Info label={t('studyType')} value={studyTypeLabel(data.studyType)} />
        <Info label={t('studyLanguage')} value={studyLangLabel(data.studyLanguage)} />
        <Info label={t('passport')} value={data.foreignPassportNumber} />
        <Info label={t('passportIssue')} value={fmt(data.foreignPassportIssueDate)} />
        <Info label={t('passportExpiry')} value={fmt(data.foreignPassportExpiryDate)} />
        <Info label={t('submittedAt')} value={new Date(data.createdAt).toLocaleString('az-AZ')} />
        <div className="md:col-span-2">
          <p className="text-gray-500 text-xs mb-1">{t('registrationAddress')}</p>
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{data.registrationAddress}</p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{t('documents')}</h2>
          <button
            type="button"
            onClick={regeneratePdf}
            disabled={pdfBusy}
            className="text-sm px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {pdfBusy ? t('regeneratingPdf') : t('regeneratePdf')}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {data.summaryPdf && (
            <DocLink
              key={`summary-${pdfKey}`}
              admissionId={data.id}
              field="summary"
              fileUrl={data.summaryPdf}
              label={t('pdfSummary')}
              openLabel={tCommon('openFullscreen')}
            />
          )}
          <DocLink
            admissionId={data.id}
            field="attestat"
            fileUrl={data.attestatFile}
            label={t('attestat')}
            openLabel={tCommon('openFullscreen')}
          />
          <DocLink
            admissionId={data.id}
            field="passport"
            fileUrl={data.passportFile}
            label={t('passport')}
            openLabel={tCommon('openFullscreen')}
          />
          <DocLink
            admissionId={data.id}
            field="photo"
            fileUrl={data.photoFile}
            label={t('photo')}
            openLabel={tCommon('openFullscreen')}
          />
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function DocLink({
  admissionId,
  field,
  fileUrl,
  label,
  openLabel,
}: {
  admissionId: number;
  field: 'attestat' | 'passport' | 'photo' | 'summary';
  fileUrl: string;
  label: string;
  openLabel: string;
}) {
  const apiSrc = `/api/admin/online-admissions/${admissionId}/file?field=${field}&t=${encodeURIComponent(fileUrl)}`;
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 min-w-[200px] max-w-[280px]">
      {isPdf ? (
        <iframe
          src={`${apiSrc}#toolbar=0&navpanes=0`}
          title={label}
          className="h-52 w-full rounded border border-gray-200 dark:border-zinc-700 bg-white"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apiSrc}
          alt={label}
          className="h-52 w-full object-contain rounded border border-gray-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
        />
      )}
      <a
        href={apiSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-600 dark:text-blue-400 text-center hover:underline"
      >
        {label} {openLabel}
      </a>
    </div>
  );
}
