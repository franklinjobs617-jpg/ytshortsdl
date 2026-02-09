import type { Metadata } from "next";
import "../globals.css";
import Script from 'next/script'
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/auth-context";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import PayPalProviderWrapper from "@/components/PayPalProviderWrapper";
import { ToastProvider } from "@/components/ToastContext";
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Banner from '@/components/Banner';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Free YouTube Shorts Downloader | HD MP4 & MP3 | AI Video to Script',
  description: 'Download YouTube Shorts videos and audio (MP4/MP3) instantly. Now featuring AI-powered video to script converter and viral script generator for creators.',
  alternates: {
    canonical: 'https://ytshortsdl.net/',
  },
  verification: {
    other: {
      "saashub-verification": "dbxb8loh2q88",
      "_foundr": "289d6c36028737fde5b41ffd2926f57c",
    },
  },
};

export default async function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Next.js 15 之后 params 是 Promise
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>



      <body>
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        <GoogleAnalytics gaId="G-Z6TQTL70L0" />
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "u5xi8vjmmq");
              `,
          }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <PayPalProviderWrapper>
              <ToastProvider>

                <Header />
                <Banner />
                {children}
                <Footer />
              </ToastProvider>
            </PayPalProviderWrapper>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
