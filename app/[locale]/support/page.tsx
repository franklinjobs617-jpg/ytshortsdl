
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support & Help Center | YTShortsDL.net',
    description: 'Get help with SnapShorts - Pro browser extension. Troubleshooting, FAQs, and support contact information.',
    alternates: {
        canonical: 'https://ytshortsdl.net/support',
    },
    openGraph: {
        title: 'Support & Help Center | YTShortsDL.net',
        description: 'Get help with SnapShorts - Pro browser extension. Troubleshooting, FAQs, and support contact information.',
        url: 'https://ytshortsdl.net/support',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Support & Help Center | YTShortsDL.net',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Support & Help Center | YTShortsDL.net',
        description: 'Get help with SnapShorts - Pro browser extension. Troubleshooting, FAQs, and support contact information.',
        images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};
export default function Privacy() {
    return (
        <main>
            <section className="py-20 md:py-24 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    <article>
                        <h1
                            className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900 text-center mb-12">
                            SnapShorts - Pro<br /><span className="text-red-500">Support & Help Center</span>
                        </h1>

                        <div className="space-y-16">
                            <section id="what-is">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    What is SnapShorts - Pro?</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    SnapShorts - Pro is a premium browser extension designed to easily download YouTube
                                    Shorts videos and audio files directly from the Shorts page. We aim to provide a fast,
                                    secure, and user-friendly downloading experience.
                                </p>
                            </section>

                            <section id="faq">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-6 pb-2 border-b border-slate-200">
                                    Troubleshooting & Frequently Asked Questions (FAQ)</h2>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2">Q: The Download button is not
                                            showing up. What should I do?</h3>
                                        <p className="text-slate-700 mb-3">A: This is the most common issue. Please try the
                                            following steps:</p>
                                        <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                                            <li>Ensure you are watching a direct YouTube Shorts video (URL format:
                                                <code
                                                    className="bg-slate-200 text-red-600 px-1 py-0.5 rounded text-sm font-mono">https://www.youtube.com/shorts/...</code>).
                                            </li>
                                            <li>Refresh the page.</li>
                                            <li>If the problem persists, try disabling and re-enabling the extension in your
                                                browser's extension manager.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2">Q: Why did my download fail or
                                            stop unexpectedly?</h3>
                                        <p className="text-slate-700 mb-3">A: Download failures are usually caused by external
                                            factors:</p>
                                        <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                                            <li><strong>Network Issues:</strong> A temporary connection drop will interrupt
                                                the download. Please try again.</li>
                                            <li><strong>YouTube Restrictions:</strong> Occasionally, YouTube may apply
                                                temporary rate limits or change video streams. Please wait a few minutes and
                                                attempt the download again.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section id="transparency">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    Transparency: API Usage</h2>
                                <p className="text-slate-700 leading-relaxed mb-4">SnapShorts - Pro relies on a dedicated,
                                    secure backend API to process downloads:</p>

                                <div className="bg-white border-l-4 border-slate-400 pl-6 py-2 space-y-4">
                                    <div>
                                        <strong className="text-slate-900 block">API Endpoint:</strong>
                                        <code
                                            className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-mono block mt-1 w-fit">https://api.ytshortsdl.net/v1/</code>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 block">Purpose:</strong>
                                        <p className="text-slate-600">The extension sends the video URL to this API, which then
                                            extracts the video stream links and generates a direct download URL back to your
                                            browser. This process ensures reliability and access to multiple quality
                                            formats.</p>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 block">Data Privacy:</strong>
                                        <p className="text-slate-600">We only transmit the active video URL upon your command
                                            (when you click 'Download'). We do not store your browsing history or collect
                                            any Personally Identifiable Information (PII).</p>
                                    </div>
                                </div>
                            </section>

                            <section id="contact">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    Contact Us for Support</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">If your issue is not resolved by the FAQ
                                    above, please reach out to our support team.</p>

                                <div className="bg-red-50 border border-red-100 p-6 rounded-lg text-center md:text-left">
                                    <p className="text-lg text-slate-800">
                                        <strong className="block md:inline mb-2 md:mb-0">Support Email:</strong>
                                        <a href="mailto:support@ytshortsdl.net"
                                            className="font-bold text-red-600 hover:text-red-700 underline text-xl md:ml-2">support@ytshortsdl.net</a>
                                    </p>
                                    <p className="text-slate-500 text-sm mt-2">(Please allow 24-48 hours for a response.)</p>
                                </div>
                            </section>



                        </div>
                    </article>
                </div>
            </section>
        </main>

    );
}