'use client';

import UniversityHubForm, { type HubFormState } from '@/components/admin/UniversityHubForm';
import { emptyHubLocales } from '@/lib/university-hub';

const initial: HubFormState = {
  slug: '',
  icon: '🎓',
  flagImage: '',
  image: '',
  accentColor: 'blue',
  sortOrder: 10,
  isActive: true,
  title: emptyHubLocales(),
  subtitle: emptyHubLocales(),
};

export default function NewUniversityHubPage() {
  return <UniversityHubForm initial={initial} />;
}
