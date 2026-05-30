import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "../globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GraduationScrollTop from '@/components/GraduationScrollTop';
import { getContactContent } from '@/lib/contact-content';

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

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer contact={contact} />
      <GraduationScrollTop />
    </NextIntlClientProvider>
  );
}
