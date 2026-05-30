'use client';

import { EMPTY_LOCALES } from '@/lib/locale-content';

const LOCALES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ge', name: 'ქართული' },
];

type FieldConfig = {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
};

type LocaleJsonEditorProps = {
  activeTab: string;
  onTabChange: (code: string) => void;
  values: Record<string, Record<string, string>>;
  onChange: (fieldKey: string, locale: string, value: string) => void;
  fields: FieldConfig[];
};

export { LOCALES, EMPTY_LOCALES };

export default function LocaleJsonEditor({
  activeTab,
  onTabChange,
  values,
  onChange,
  fields,
}: LocaleJsonEditorProps) {
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500';

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-zinc-800 space-x-1 overflow-x-auto mb-6">
        {LOCALES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onTabChange(lang.code)}
            className={`py-2 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === lang.code
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label} ({activeTab.toUpperCase()})
            </label>
            {field.multiline ? (
              <textarea
                rows={field.key === 'content' ? 10 : 6}
                className={inputClass}
                value={values[field.key]?.[activeTab] || ''}
                onChange={(e) => onChange(field.key, activeTab, e.target.value)}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type="text"
                className={inputClass}
                value={values[field.key]?.[activeTab] || ''}
                onChange={(e) => onChange(field.key, activeTab, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
