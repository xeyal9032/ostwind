'use client';

import StudentAuthForm from '@/components/forms/StudentAuthForm';

type Mode = 'login' | 'register';

/** Auth səhifələri üçün client wrapper — admin bundle ilə qarışmır */
export default function StudentAuthFormLoader({ mode }: { mode: Mode }) {
  return <StudentAuthForm mode={mode} />;
}
