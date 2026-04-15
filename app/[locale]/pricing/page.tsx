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
            {/* <PricingTable /> */}

            <div className='container mx-auto px-4 py-30 text-center'>
                <h1 className='text-3xl font-bold mb-4'>Pricing Plans</h1>
                <p className='text-lg mb-6'>Our pricing plans are coming soon! Stay tuned for updates.</p>
                <a href='/' className='text-blue-500 hover:underline bg-black px-4 py-2 rounded text-white hover:bg-gray-800 transition-colors duration-300'>
                    Back to Home
                </a>
            </div>
        </main>
    );
}