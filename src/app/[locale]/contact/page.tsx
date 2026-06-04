import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/forms/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import ContactDirectionsVideo from '@/components/ContactDirectionsVideo';
import { getContactContent, getContactSubtitle } from '@/lib/contact-content';
import { CONTACT_DIRECTIONS_VIDEO } from '@/lib/contact-media';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Contact');
  const contact = await getContactContent();
  const subtitle = getContactSubtitle(contact, locale, t('subtitle'));

  return (
    <div className="section-pad min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="page-title font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-10 items-start">
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>
          <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('formTitle')}</h2>
            <ContactForm />
          </div>
        </div>

        <ContactDirectionsVideo
          title={t('directionsVideoTitle')}
          description={t('directionsVideoDesc')}
          src={CONTACT_DIRECTIONS_VIDEO}
        />
      </div>
    </div>
  );
}
