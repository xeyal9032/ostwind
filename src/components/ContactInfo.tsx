import { getTranslations } from 'next-intl/server';
import { getContactContent } from '@/lib/contact-content';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default async function ContactInfo() {
  const t = await getTranslations('Contact');
  const c = await getContactContent();

  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{t('infoTitle')}</h2>

        <div className="space-y-5 text-sm">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">{t('addressLabel')}</p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{c.address}</p>
            <a
              href={c.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('openMaps')} →
            </a>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">{t('phoneLabel')}</p>
            <a
              href={`tel:+${c.phoneE164}`}
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {c.phone}
            </a>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('hoursLabel')}</p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex justify-between gap-4">
                <span>{t('weekdays')}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{c.hoursWeekdays}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>{t('saturday')}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{c.hoursSaturday}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>{t('sunday')}</span>
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  {c.sundayClosed ? t('sundayClosed') : c.hoursSunday}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        <a
          href={c.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#25D366] px-5 py-4 text-white font-semibold shadow-lg shadow-green-500/20 transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-6 w-6 shrink-0" />
          <span className="text-left">
            <span className="block">{t('whatsapp')}</span>
            <span className="block text-sm font-normal text-white/90">{c.phone}</span>
          </span>
        </a>

        <a
          href={c.mailtoUrl}
          className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-blue-600 bg-white px-5 py-4 font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:-translate-y-0.5 dark:border-blue-500 dark:bg-zinc-900 dark:text-blue-300 dark:hover:bg-zinc-800"
        >
          <MailIcon className="h-6 w-6 shrink-0" />
          <span className="text-left">
            <span className="block">{t('sendEmail')}</span>
            <span className="block text-sm font-normal text-gray-500 dark:text-gray-400">{c.email}</span>
          </span>
        </a>
      </div>
    </aside>
  );
}
