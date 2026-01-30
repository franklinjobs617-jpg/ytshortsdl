import type { Metadata } from "next";
import "./globals.css";
import Script from 'next/script'
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/auth-context";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import Head from "next/head";
import PayPalProviderWrapper from "@/components/PayPalProviderWrapper";
import { ToastProvider } from "@/components/ToastContext";
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="color-scheme" content="light only" />
      </Head>
      <GoogleAnalytics gaId="G-Z6TQTL70L0" />
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive" // 在页面交互后加载，不影响首屏速度
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
      <body>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <AuthProvider>
          <PayPalProviderWrapper>
            <ToastProvider>
              <Header />
              <div className="w-full bg-gradient-to-r from-[#ff0000af] to-[#ff73004b] py-2.5 px-4 shadow-md font-sans">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">

                  <div className="flex items-center gap-3 text-white">
                    <span className="bg-white/20 text-xs font-medium px-2 py-1 rounded">
                      AI Tool
                    </span>
                    <p className="text-sm font-medium">
                      Remove any watermark or logo from images/videos instantly!
                    </p>
                  </div>

                  <a href="https://removermarca.com/en?utm_source=ytshortsdl&utm_content=footer_bar"
                    target="_blank"
                    className="bg-white text-[#007bff] text-[13px] font-bold px-4 py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Try Free
                  </a>

                </div>
              </div>
              {children}
              <Footer />
            </ToastProvider>
          </PayPalProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
