'use client';

import Image from 'next/image';

type Props = {
  flagUrl?: string;
  campusUrl?: string;
  title?: string;
};

/** Admin formada bayraq və kampus önizləməsi */
export default function HubMediaPreview({ flagUrl, campusUrl, title }: Props) {
  if (!flagUrl && !campusUrl) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-4 items-start rounded-lg border border-dashed border-gray-300 dark:border-zinc-600 p-4 bg-gray-50 dark:bg-zinc-800/50">
      {flagUrl ? (
        <div>
          <p className="text-xs text-gray-500 mb-1">Bayraq</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flagUrl}
            alt=""
            className="h-10 w-14 object-cover rounded shadow ring-1 ring-gray-200"
          />
        </div>
      ) : null}
      {campusUrl ? (
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500 mb-1">Kampus / universitet</p>
          <div className="relative h-28 w-full max-w-xs rounded-lg overflow-hidden bg-gray-200">
            <Image
              src={campusUrl}
              alt={title ?? 'Önizləmə'}
              fill
              className="object-cover"
              unoptimized={campusUrl.startsWith('http')}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
