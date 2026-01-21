import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/auth-context";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'


export const metadata: Metadata = {
  title: 'Free YouTube Shorts Downloader | HD MP4 & MP3',
  description: 'Download YouTube Shorts videos and audio (MP4/MP3) instantly and for free. The fastest YT Shorts Downloader with no ads.',
  alternates: {
    canonical: 'https://ytshortsdl.net/',
  },
  openGraph: {
    title: 'Free YouTube Shorts Downloader | HD MP4 & MP3',
    description: 'Download YouTube Shorts videos and audio (MP4/MP3) instantly and for free. The fastest YT Shorts Downloader with no ads.',
    url: 'https://ytshortsdl.net/',
    type: 'website',
    images: [
      {
        url: 'https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png',
        width: 1200,
        height: 630,
        alt: 'Free YouTube Shorts Downloader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free YouTube Shorts Downloader | HD MP4 & AI Tools',
    description: 'Download YouTube Shorts (MP4/MP3) instantly. No ads.',
    images: ['https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
      <body
        className={``}
      >
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
