
import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Shorts Downloader Pricing | Subscriptions & Credits',
    description: 'View AI Shorts Downloader Pricing for our Pro tools. Compare shorts subscription plans or buy watermark remover credits. Get 4K downloads instantly.',
    alternates: {
        canonical: 'https://ytshortsdl.net/pricing',
    },
    openGraph: {
        title: 'AI Shorts Downloader Pricing | Subscriptions & Credits',
        description: 'View AI Shorts Downloader Pricing for our Pro tools. Compare shorts subscription plans or buy watermark remover credits. Get 4K downloads instantly.',
        url: 'https://ytshortsdl.net/pricing',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'AI Shorts Downloader Pricing',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Shorts Downloader Pricing | Subscriptions & Credits',
        description: 'View AI Shorts Downloader Pricing for our Pro tools. Compare shorts subscription plans or buy watermark remover credits. Get 4K downloads instantly.',
        images: ['https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};
export default function Pricing() {
    return (
        <main className="container mx-auto px-4 py-16 sm:py-24 space-y-20">

            <section className="text-center max-w-4xl mx-auto">
                <div
                    className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-red-600 uppercase bg-red-100 rounded-full">
                    Early Access
                </div>
                <h1
                    className="text-4xl md:text-6xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900 mb-6">
                    AI Creator Suite is <br /><span className="text-red-500">Coming Soon</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                    We are building the ultimate toolkit for YouTube Shorts creators. Get ready for 4K downloads, AI
                    watermark removal, and auto-transcription.
                </p>

                <div
                    className="max-w-md mx-auto bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2">
                    <input type="email" placeholder="Enter your email address"
                        className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700"
                        required />
                    <button
                        className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-md whitespace-nowrap">
                        Notify Me
                    </button>
                </div>
                <p className="mt-4 text-sm text-slate-500"><i className="fas fa-lock mr-1"></i> No spam. Unsubscribe anytime.</p>
            </section>

            <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div
                    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                    <div
                        className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 text-2xl">
                        <i className="fas fa-video"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">4K & 8K Downloads</h3>
                    <p className="text-slate-600">Download source-quality video files without compression. Perfect for
                        professional editing and archiving.</p>
                </div>

                <div
                    className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Flagship</div>
                    <div
                        className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 text-red-600 text-2xl">
                        <i className="fas fa-eraser"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">AI Watermark Remover</h3>
                    <p className="text-slate-600">Our proprietary AI intelligently fills in watermarked areas, giving you clean
                        video for TikTok & Reels.</p>
                </div>

                <div
                    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                    <div
                        className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600 text-2xl">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Auto-Transcript</h3>
                    <p className="text-slate-600">Instantly generate accurate text transcripts from audio. Great for repurposing
                        content into blog posts.</p>
                </div>
            </section>

            <section
                className="bg-slate-900 text-white rounded-3xl p-8 md:p-16 max-w-5xl mx-auto text-center relative overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20">
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">Why Join the Waitlist?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
                        <div className="flex items-start">
                            <i className="fas fa-gift text-red-500 text-2xl mt-1 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Free Early Access</h4>
                                <p className="text-slate-400 text-sm">Be the first to test our tools before the public launch.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <i className="fas fa-percent text-red-500 text-2xl mt-1 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Exclusive Discount</h4>
                                <p className="text-slate-400 text-sm">Get a lifetime discount code when we officially launch.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <i className="fas fa-star text-red-500 text-2xl mt-1 mr-4"></i>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Shape the Product</h4>
                                <p className="text-slate-400 text-sm">Your feedback will directly influence which features we
                                    build next.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="max-w-3xl mx-auto">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group bg-white p-6 rounded-lg shadow-sm border border-slate-200 cursor-pointer">
                        <summary className="flex items-center justify-between font-semibold text-lg text-slate-800 list-none">
                            When will the Pro tools launch?<i
                                className="fas fa-chevron-down transition-transform duration-300 group-open:rotate-180"></i>
                        </summary>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            We are currently in the final stages of development. We expect to open the beta to waitlist
                            members within the next few weeks.
                        </p>
                    </details>
                    <details className="group bg-white p-6 rounded-lg shadow-sm border border-slate-200 cursor-pointer">
                        <summary className="flex items-center justify-between font-semibold text-lg text-slate-800 list-none">
                            Will the basic downloader remain free?<i
                                className="fas fa-chevron-down transition-transform duration-300 group-open:rotate-180"></i>
                        </summary>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            Absolutely. The core YouTube Shorts downloader (up to 1080p) will always be free and unlimited
                            for everyone.
                        </p>
                    </details>
                    <details className="group bg-white p-6 rounded-lg shadow-sm border border-slate-200 cursor-pointer">
                        <summary className="flex items-center justify-between font-semibold text-lg text-slate-800 list-none">
                            How does the AI Watermark Remover work?<i
                                className="fas fa-chevron-down transition-transform duration-300 group-open:rotate-180"></i>
                        </summary>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            Our tool uses advanced computer vision to identify static overlays and fills them in using
                            surrounding pixel data, creating a clean video that looks like the original source file.
                        </p>
                    </details>
                </div>
            </section>

        </main>

    );
}