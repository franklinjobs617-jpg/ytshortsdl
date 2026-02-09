import { Metadata } from 'next';
import PricingTable from "@/components/PricingTable";

export const metadata: Metadata = {
    title: 'Pricing Plans | AI YouTube Shorts Downloader',
    description: 'Choose the best plan for your needs. Get unlimited YouTube Shorts downloads, AI script generation, and 4K quality with our Pro and Elite subscriptions.',
    alternates: {
        canonical: 'https://ytshortsdl.net/pricing',
    },
    openGraph: {
        title: 'Pricing Plans | AI YouTube Shorts Downloader',
        description: 'Choose the best plan for your needs. Get unlimited YouTube Shorts downloads, AI script generation, and 4K quality.',
        url: 'https://ytshortsdl.net/pricing',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Pricing Plans',
            },
        ],
    },
};

export default function PricingPage() {
    return (
        <main>
            <PricingTable />
        </main>
    );
}