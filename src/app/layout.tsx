import type { Metadata } from "next";
import { cookies } from "next/headers";
import { fontClassNames } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "OstWind Group - Eğitim Danışmanlığı",
  description: "Yurtdışı eğitim danışmanlığı, üniversite başvuruları ve daha fazlası.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'az';

  return (
    <html lang={locale} className={`${fontClassNames} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
