import HeroSection from "@/components/HeroSection";
import { StaticContent } from "@/components/StaticContent";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: 'Free YouTube Shorts Downloader | HD MP4 & MP3',
  description: 'Download YouTube Shorts videos and audio (MP4/MP3) instantly and for free. The fastest YT Shorts Downloader with no ads.',
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