'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type ImageUploadFieldProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
};

export default function ImageUploadField({
  id = 'image',
  label,
  value,
  onChange,
  placeholder,
}: ImageUploadFieldProps) {
  const t = useTranslations('common');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fieldLabel = label ?? t('photoLabel');
  const fieldPlaceholder = placeholder ?? t('imageUrlPlaceholder');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        setUploadError(t('uploadImageFailed'));
      }
    } catch {
      setUploadError(t('connectionError'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {fieldLabel}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={id}
          type="text"
          placeholder={fieldPlaceholder}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="relative shrink-0">
          <input
            type="file"
            accept="image/*"
            title={t('selectImage')}
            aria-label={t('selectImage')}
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled={uploading}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors border border-gray-300 dark:border-zinc-700 h-full min-h-[42px] flex items-center justify-center whitespace-nowrap disabled:opacity-60"
          >
            {uploading ? t('uploading') : t('uploadPhoto')}
          </button>
        </div>
      </div>
      {uploadError && <p className="mt-1 text-sm text-red-500">{uploadError}</p>}
      {value && (
        <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={t('preview')} className="object-cover w-full h-full" />
        </div>
      )}
    </div>
  );
}
