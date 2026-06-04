'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import UniversityHubForm, { type HubFormState } from '@/components/admin/UniversityHubForm';
import { mergeLocaleJson } from '@/lib/locale-content';
import { emptyHubLocales } from '@/lib/university-hub';

export default function EditUniversityHubPage() {
  const { id } = useParams();
  const tCommon = useTranslations('common');
  const [initial, setInitial] = useState<HubFormState | null>(null);

  useEffect(() => {
    fetch(`/api/admin/university-hubs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((hub) => {
        if (!hub) return;
        setInitial({
          slug: hub.slug,
          icon: hub.icon || '',
          flagImage: hub.flagImage || '',
          image: hub.image || '',
          accentColor: hub.accentColor || 'blue',
          sortOrder: hub.sortOrder ?? 0,
          isActive: hub.isActive !== false,
          title: { ...emptyHubLocales(), ...mergeLocaleJson(hub.title) },
          subtitle: { ...emptyHubLocales(), ...mergeLocaleJson(hub.subtitle) },
        });
      });
  }, [id]);

  if (!initial) {
    return <p className="text-gray-500">{tCommon('loading')}</p>;
  }

  return <UniversityHubForm initial={initial} hubId={parseInt(String(id), 10)} />;
}
