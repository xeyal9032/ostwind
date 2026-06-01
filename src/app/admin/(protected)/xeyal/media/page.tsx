'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type MediaFile = {
  id: number;
  filename: string;
  path: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

function formatSize(bytes: number | null) {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function XeyalMediaPage() {
  const tMedia = useTranslations('xeyal.media');
  const tCommon = useTranslations('common');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/xeyal/media');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setFiles(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: number) => {
    if (!confirm(tCommon('mediaDeleteConfirm'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/xeyal/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) setFiles((prev) => prev.filter((f) => f.id !== id));
      else alert(tMedia('deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">{tCommon('loading')}</p>;

  if (files.length === 0) {
    return <p className="text-gray-500">{tCommon('mediaEmpty')}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file) => {
        const isImage = file.mimeType?.startsWith('image/');
        return (
          <div
            key={file.id}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="aspect-square bg-gray-100 dark:bg-zinc-800 flex items-center justify-center relative">
              {isImage ? (
                <Image
                  src={file.path}
                  alt={file.filename}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : (
                <span className="text-4xl text-gray-400">📄</span>
              )}
            </div>
            <div className="p-3 text-sm">
              <p className="font-medium text-gray-900 dark:text-white truncate" title={file.filename}>
                {file.filename}
              </p>
              <p className="text-gray-500 text-xs mt-1">{formatSize(file.sizeBytes)}</p>
              <p className="text-gray-400 text-xs">
                {new Date(file.createdAt).toLocaleDateString('tr-TR')}
              </p>
              <button
                type="button"
                disabled={deletingId === file.id}
                onClick={() => remove(file.id)}
                className="mt-2 text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
              >
                {deletingId === file.id ? tCommon('deleting') : tCommon('delete')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
