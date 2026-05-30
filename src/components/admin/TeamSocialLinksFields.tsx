'use client';

import type { TeamSocialLinks } from '@/lib/team-social';

type TeamSocialLinksFieldsProps = {
  value: TeamSocialLinks;
  onChange: (links: TeamSocialLinks) => void;
};

export default function TeamSocialLinksFields({ value, onChange }: TeamSocialLinksFieldsProps) {
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500';

  const update = (field: keyof TeamSocialLinks, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-zinc-800">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sosyal bağlantılar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Hakkımızda sayfasında görünecek LinkedIn, X (Twitter) ve e-posta linkleri.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            LinkedIn URL
          </label>
          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
            value={value.linkedin || ''}
            onChange={(e) => update('linkedin', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            X (Twitter) URL
          </label>
          <input
            id="twitter"
            type="url"
            placeholder="https://x.com/..."
            className={inputClass}
            value={value.twitter || ''}
            onChange={(e) => update('twitter', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            placeholder="ornek@ostwindgroup.com"
            className={inputClass}
            value={value.email || ''}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
