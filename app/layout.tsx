import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/auth-context";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import Head from "next/head";

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

          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
