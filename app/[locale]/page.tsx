import HeroSection from "@/components/HeroSection";
import { StaticContent } from "@/components/StaticContent";
import { Metadata } from "next";
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const metadata = {
    en: {
      title: 'Free YouTube Shorts Downloader | HD MP4 & MP3 | AI Video to Script',
      description: 'Download YouTube Shorts videos and audio (MP4/MP3) instantly. Now featuring AI-powered video to script converter and viral script generator for creators.',
    },
    hi: {
      title: 'मुफ्त YouTube शॉर्ट्स डाउनलोडर | HD MP4 और MP3 | AI वीडियो से स्क्रिप्ट',
      description: 'YouTube शॉर्ट्स वीडियो और ऑडियो (MP4/MP3) तुरंत डाउनलोड करें। अब निर्माताओं के लिए AI-संचालित वीडियो से स्क्रिप्ट कनवर्टर और वायरल स्क्रिप्ट जेनरेटर शामिल है।',
    },
    es: {
      title: 'Descargar Videos de YouTube Gratis | YouTube to MP4 Downloader',
      description: 'La mejor web para descargar videos de YouTube gratis y descargar YouTube Shorts. Convierte YouTube to MP4 y MP3 de alta calidad. Compatible con Twitter. ¡Rápido y fácil!',
    }
  };

  const currentMeta = metadata[locale as keyof typeof metadata] || metadata.en;
  const baseUrl = 'https://ytshortsdl.net';
  const currentUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': baseUrl,
        'hi': `${baseUrl}/hi`,
        'es': `${baseUrl}/es`,
      },
    },
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      url: currentUrl,
      type: 'website',
      locale,
      alternateLocale: locale,
      images: [
        {
          url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
          width: 1200,
          height: 630,
          alt: currentMeta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMeta.title,
      description: currentMeta.description,
      images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
  };
}
export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* 静态内容区域，利于 SEO */}
      <div className="bg-white">
        <StaticContent />
      </div>
    </main>
  );
}