import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | YTShortsDL.net',
    description: 'Read the Terms of Service for YTShortsDL.net. Understand the rules and guidelines for using our free YouTube Shorts downloader and premium AI tools.',
    alternates: {
        canonical: 'https://ytshortsdl.net/terms',
    },
    openGraph: {
        title: 'Terms of Service | YTShortsDL.net',
        description: 'Understand the rules and guidelines for using our free YouTube Shorts downloader and premium AI tools on YTShortsDL.net.',
        url: 'https://ytshortsdl.net/terms',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Terms of Service | YTShortsDL.net',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms of Service | YTShortsDL.net',
        description: 'Understand the rules and guidelines for using our free YouTube Shorts downloader and premium AI tools on YTShortsDL.net.',
        images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};

export default function Terms() {
    return (
        <main>
            <section className="py-20 md:py-24 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    <article>
                        <h1
                            className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900">
                            Terms of Service</h1>
                        <p className="mt-2 text-slate-500"><strong>Last updated:</strong> November 9, 2025</p>

                        <div className="mt-12 space-y-12">
                            <section id="acceptance">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    1. Acceptance of Terms</h2>
                                <p className="text-slate-700 leading-relaxed">By accessing and using the YtShortsDL.net website
                                    and its services, you agree to comply with and be bound by these Terms of Service.</p>
                            </section>

                            <section id="ip-rights">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    2. Intellectual Property and User Responsibility</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">YtShortsDL.net is solely a technical tool
                                    designed to facilitate downloading content that you, the user, have the legal right to
                                    access.</p>
                                <ul className="list-disc list-outside space-y-3 pl-6 text-slate-700">
                                    <li><strong className="text-slate-900">IP Responsibility:</strong> You, and not
                                        YtShortsDL.net, are solely responsible for all content you download. You affirm that
                                        you have the necessary permissions, consent, or legal right to download and use the
                                        content.</li>
                                    <li><strong className="text-slate-900">Prohibited Use:</strong> The service is intended for
                                        personal, non-commercial use, or for commercial use where the user has explicit,
                                        legal permission from the content owner.</li>
                                    <li>We do not host content and we do not store files beyond the required processing
                                        time.</li>
                                </ul>
                            </section>

                            <section id="paid-services">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    3. Paid Services, Usage Quota, and AI Tools</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">We offer premium, paid services (e.g., AI
                                    Watermark Remover, 4K/8K Downloads) accessible via subscription or daily usage quotas.
                                </p>
                                <ul className="list-disc list-outside space-y-3 pl-6 text-slate-700">
                                    <li><strong className="text-slate-900">No Refunds:</strong> Due to the immediate,
                                        non-reversible nature of digital content processing, all purchases of usage quotas and
                                        subscriptions for AI services are <strong
                                            className="text-slate-900">non-refundable</strong>.</li>
                                    <li><strong className="text-slate-900">Service Availability:</strong> We reserve the right
                                        to
                                        modify or discontinue any paid service feature at any time.</li>
                                </ul>
                            </section>

                            <section id="usage-restrictions">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    4. Prohibited Activities</h2>
                                <p className="text-slate-700 leading-relaxed">You agree not to use the service for mass,
                                    automated scraping, illegal activities, distributing malware, or circumventing
                                    technological measures designed to protect content.</p>
                            </section>

                            <section id="disclaimer-liability">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    5. Disclaimer of Warranties and Limitation of Liability</h2>
                                <p className="text-slate-700 leading-relaxed">THE SERVICE IS PROVIDED "AS IS." YtShortsDL.NET
                                    DISCLAIMS ALL WARRANTIES. WE SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
                                    OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING DAMAGES RELATED
                                    TO DOWNLOADED CONTENT OR SERVICE INTERRUPTION.</p>
                            </section>
                        </div>
                    </article>
                </div>
            </section>
        </main>

    );
}