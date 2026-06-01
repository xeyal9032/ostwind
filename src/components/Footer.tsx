'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FooterBrandLogo from '@/components/FooterBrandLogo';
import AnimatedBrandLogo from '@/components/AnimatedBrandLogo';
import type { ContactContentPublic } from '@/lib/contact-content';
import { useSiteText } from '@/components/SiteContentProvider';

export default function Footer({ contact }: { contact: ContactContentPublic }) {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const description = useSiteText('footer', 'description', locale, t('description'));
  const quickLinks = useSiteText('footer', 'quickLinks', locale, t('quickLinks'));
  const universities = useSiteText('footer', 'universities', locale, t('universities'));
  const services = useSiteText('footer', 'services', locale, t('services'));
  const pricing = useSiteText('footer', 'pricing', locale, t('pricing'));
  const faq = useSiteText('footer', 'faq', locale, t('faq'));
  const blog = useSiteText('footer', 'blog', locale, t('blog'));
  const about = useSiteText('footer', 'about', locale, t('about'));
  const contactLabel = useSiteText('footer', 'contact', locale, t('contact'));
  const contactUs = useSiteText('footer', 'contactUs', locale, t('contactUs'));
  const followUs = useSiteText('footer', 'followUs', locale, t('followUs'));
  const language = useSiteText('footer', 'language', locale, t('language'));
  const allRightsReserved = useSiteText('footer', 'allRightsReserved', locale, t('allRightsReserved'));

  return (
    <footer className="bg-zinc-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <AnimatedBrandLogo variant="footer" />
            <p className="text-gray-400 text-sm text-center">{description}</p>
            <div className="flex w-full justify-center pt-1">
              <FooterBrandLogo />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{quickLinks}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/universities" className="hover:text-white transition-colors">
                  {universities}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {services}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {pricing}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  {faq}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {blog}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {contactLabel}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{contactUs}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href={contact.mailtoUrl} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {contact.phone}
                </a>
              </li>
              <li className="leading-relaxed">{contact.address}</li>
            </ul>
          </div>

          <LanguageSwitcher title={language} />

          <div>
            <h3 className="text-lg font-semibold mb-4">{followUs}</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#1877F2] hover:text-white"
              >
                Facebook
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] hover:text-white"
              >
                Instagram
              </a>
              <a
                href={contact.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-black hover:text-white"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} OstWindGroup. {allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
