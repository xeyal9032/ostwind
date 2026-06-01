import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "../globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GraduationScrollTop from '@/components/GraduationScrollTop';
import { getContactContent } from '@/lib/contact-content';
import { getSiteContent } from '@/lib/site-content';
import { SiteContentProvider } from '@/components/SiteContentProvider';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // params bir Promise olduğu için await ile açılması gerekir (Next.js 15+)
  await params;

  const messages = await getMessages();
  const contact = await getContactContent();
  const siteContent = await getSiteContent();

  return (
    <NextIntlClientProvider messages={messages}>
      <SiteContentProvider content={siteContent}>
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer contact={contact} />
        <GraduationScrollTop />
      </SiteContentProvider>
    </NextIntlClientProvider>
  );
}
