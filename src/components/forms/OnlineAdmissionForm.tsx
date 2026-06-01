'use client';

import { useEffect, useId, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';

type UniversityOption = {
  id: number;
  name: string;
  tuitionFeeFullTime: string;
  tuitionFeePartTime: string;
};

type StudentInfo = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function OnlineAdmissionForm({ student }: { student: StudentInfo }) {
  const t = useTranslations('OnlineAdmission');
  const locale = useLocale();
  const router = useRouter();

  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState('');
  const [registrationAddress, setRegistrationAddress] = useState('');
  const [foreignPassportNumber, setForeignPassportNumber] = useState('');
  const [foreignPassportIssueDate, setForeignPassportIssueDate] = useState('');
  const [foreignPassportExpiryDate, setForeignPassportExpiryDate] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [studyType, setStudyType] = useState('FULL_TIME');
  const [studyLanguage, setStudyLanguage] = useState('EN');
  const [attestat, setAttestat] = useState<File | null>(null);
  const [passport, setPassport] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const registrationAddressId = useId();
  const universityIdField = useId();
  const studyTypeId = useId();
  const studyLanguageId = useId();

  useEffect(() => {
    fetch(`/api/public/universities?locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUniversities(data);
      });
  }, [locale]);

  const selectedUni = universities.find((u) => u.id === Number(universityId));
  const displayedFee =
    studyType === 'PART_TIME'
      ? selectedUni?.tuitionFeePartTime
      : selectedUni?.tuitionFeeFullTime;

  const errorMap: Record<string, string> = {
    MISSING_FIELDS: t('errors.missing'),
    ALREADY_SUBMITTED: t('errors.alreadySubmitted'),
    INVALID_PDF: t('errors.invalidPdf'),
    INVALID_PHOTO: t('errors.invalidPhoto'),
    FILE_TOO_LARGE: t('errors.fileTooLarge'),
    UNAUTHORIZED: t('errors.unauthorized'),
    INVALID_OPTION: t('errors.missing'),
    UNIVERSITY_NOT_FOUND: t('errors.missing'),
    UPLOAD_ERROR: t('errors.server'),
    SERVER_ERROR: t('errors.server'),
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData();
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('birthDate', birthDate);
    fd.append('email', email);
    fd.append('phone', phone);
    fd.append('registrationAddress', registrationAddress);
    fd.append('foreignPassportNumber', foreignPassportNumber);
    fd.append('foreignPassportIssueDate', foreignPassportIssueDate);
    fd.append('foreignPassportExpiryDate', foreignPassportExpiryDate);
    fd.append('universityId', universityId);
    fd.append('studyType', studyType);
    fd.append('studyLanguage', studyLanguage);
    if (attestat) fd.append('attestat', attestat);
    if (passport) fd.append('passport', passport);
    if (photo) fd.append('photo', photo);

    try {
      const res = await fetch('/api/student/admission', {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      });
      let data: { error?: string; detail?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(t('errors.server'));
        return;
      }
      if (!res.ok) {
        const base = errorMap[data.error || ''] || t('errors.server');
        setError(data.detail ? `${base} (${data.detail})` : base);
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError(t('errors.server'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-900">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('successTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('successDesc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('intro')}</p>
      </div>

      <section className="space-y-4 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{t('sectionPersonal')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('firstName')} value={firstName} onChange={setFirstName} required />
          <Field label={t('lastName')} value={lastName} onChange={setLastName} required />
          <Field label={t('birthDate')} type="date" value={birthDate} onChange={setBirthDate} required />
          <Field label={t('email')} type="email" value={email} onChange={setEmail} required />
          <Field label={t('phone')} type="tel" value={phone} onChange={setPhone} required className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <label htmlFor={registrationAddressId} className="block text-sm font-medium mb-1">
              {t('registrationAddress')}
            </label>
            <textarea
              id={registrationAddressId}
              name="registrationAddress"
              required
              rows={3}
              value={registrationAddress}
              onChange={(e) => setRegistrationAddress(e.target.value)}
              placeholder={t('registrationAddressHint')}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-950"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{t('sectionPassport')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t('foreignPassportNumber')}
            value={foreignPassportNumber}
            onChange={setForeignPassportNumber}
            required
            className="sm:col-span-2"
          />
          <Field
            label={t('foreignPassportIssueDate')}
            type="date"
            value={foreignPassportIssueDate}
            onChange={setForeignPassportIssueDate}
            required
          />
          <Field
            label={t('foreignPassportExpiryDate')}
            type="date"
            value={foreignPassportExpiryDate}
            onChange={setForeignPassportExpiryDate}
            required
          />
        </div>
      </section>

      <section className="space-y-4 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{t('sectionUniversity')}</h2>
        <div>
          <label htmlFor={universityIdField} className="block text-sm font-medium mb-1">
            {t('university')}
          </label>
          <select
            id={universityIdField}
            name="universityId"
            required
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-950"
          >
            <option value="">{t('selectUniversity')}</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={studyTypeId} className="block text-sm font-medium mb-1">
              {t('studyType')}
            </label>
            <select
              id={studyTypeId}
              name="studyType"
              value={studyType}
              onChange={(e) => setStudyType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-950"
            >
              <option value="FULL_TIME">{t('studyTypeFull')}</option>
              <option value="PART_TIME">{t('studyTypePart')}</option>
            </select>
          </div>
          <div>
            <label htmlFor={studyLanguageId} className="block text-sm font-medium mb-1">
              {t('studyLanguage')}
            </label>
            <select
              id={studyLanguageId}
              name="studyLanguage"
              value={studyLanguage}
              onChange={(e) => setStudyLanguage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-950"
            >
              <option value="EN">{t('langEn')}</option>
              <option value="UK">{t('langUk')}</option>
              <option value="RU">{t('langRu')}</option>
            </select>
          </div>
        </div>
        {selectedUni && displayedFee && (
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {t('tuitionFee')}: {displayedFee}
          </p>
        )}
      </section>

      <section className="space-y-4 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{t('sectionDocuments')}</h2>
        <FileField
          label={t('attestat')}
          hint={t('attestatHint')}
          accept=".pdf,application/pdf"
          name="attestat"
          onChange={setAttestat}
          required
        />
        <FileField
          label={t('passportDoc')}
          hint={t('passportHint')}
          accept=".pdf,application/pdf"
          name="passport"
          onChange={setPassport}
          required
        />
        <FileField
          label={t('photo')}
          hint={t('photoHint')}
          accept=".pdf,application/pdf,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png"
          name="photo"
          onChange={setPhoto}
          required
        />
      </section>

      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  className = '',
  name,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
  name?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-950"
      />
    </div>
  );
}

function FileField({
  label,
  hint,
  accept,
  onChange,
  required,
  name,
}: {
  label: string;
  hint: string;
  accept: string;
  onChange: (f: File | null) => void;
  required?: boolean;
  name?: string;
}) {
  const id = useId();
  const hintId = useId();
  const previewTitleId = useId();
  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selected]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelected(file);
      onChange(file);
    },
    [onChange],
  );

  const isPdf =
    selected &&
    (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf'));
  const isImage = selected && selected.type.startsWith('image/');

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <p id={hintId} className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {hint}
      </p>
      <input
        id={id}
        name={name}
        type="file"
        required={required}
        accept={accept}
        aria-describedby={hintId}
        onChange={handleChange}
        className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
      />

      {selected && previewUrl && (
        <div
          className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 overflow-hidden"
          aria-labelledby={previewTitleId}
        >
          <p
            id={previewTitleId}
            className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-zinc-700 truncate"
          >
            {selected.name}
          </p>
          {isPdf && (
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0`}
              title={selected.name}
              className="w-full h-72 sm:h-80 bg-white"
            />
          )}
          {isImage && (
            <div className="flex justify-center p-3 bg-zinc-900/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={selected.name}
                className="max-h-72 w-auto max-w-full rounded-md object-contain"
              />
            </div>
          )}
          {!isPdf && !isImage && (
            <p className="p-4 text-sm text-gray-500">Önizləmə mövcud deyil</p>
          )}
        </div>
      )}
    </div>
  );
}
