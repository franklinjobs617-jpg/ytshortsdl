
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - YtShortsDL.net',
    description: 'Read the YtShortsDL.net Privacy Policy to understand how we collect, use, and protect your information when using our YouTube Shorts downloader and AI tools.',
    alternates: {
        canonical: 'https://ytshortsdl.net/privacy',
    },
    openGraph: {
        title: 'Privacy Policy - YtShortsDL.net',
        description: 'Read the YtShortsDL.net Privacy Policy to understand how we collect, use, and protect your information when using our YouTube Shorts downloader and AI tools.',
        url: 'https://ytshortsdl.net/privacy',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Privacy Policy - YtShortsDL.net',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy - YtShortsDL.net',
        description: 'Read the YtShortsDL.net Privacy Policy to understand how we collect, use, and protect your information when using our YouTube Shorts downloader and AI tools.',
        images: ['https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};

export default function Privacy() {
    return (
        <main>
            <section className="py-20 md:py-24 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    <article>
                        <h1
                            className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900">
                            Privacy Policy</h1>
                        <p className="mt-2 text-slate-500"><strong>Last updated:</strong> November 9, 2025</p>

                        <div className="mt-12 space-y-12">
                            <section id="data-collection">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    1. Information We Collect</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">We prioritize user privacy. YtShortsDL.net
                                    does not require registration and does not intentionally collect personally identifiable
                                    information (PII) such as your name, email address, or billing address, unless you
                                    choose to contact us directly.</p>

                                <h3 className="text-xl font-bold text-slate-800 mb-3">Usage Data</h3>
                                <p className="text-slate-700 leading-relaxed mb-4">We automatically collect non-PII related to
                                    your activity on the site, specifically:</p>
                                <ul className="list-disc list-outside space-y-3 pl-6 text-slate-700">
                                    <li>The YouTube Shorts URLs submitted (to process your request).</li>
                                    <li>Technical data (browser type, operating system, IP address, access times).</li>
                                    <li>Usage statistics (pages visited, tool functions used, e.g., MP3 extraction or 4K
                                        download attempts).</li>
                                </ul>
                            </section>

                            <section id="third-party-ads">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    2. Third-Party Advertisers and Cookies (Google AdSense Compliance)</h2>
                                <p className="text-slate-700 leading-relaxed mb-4">To support the free tools on our site, we use
                                    third-party advertising partners, including <strong className="text-slate-900">Google
                                        AdSense</strong>.</p>
                                <ul className="list-disc list-outside space-y-3 pl-6 text-slate-700">
                                    <li><strong className="text-slate-900">Google AdSense:</strong> This service uses cookies
                                        and web beacons to serve ads based on a user's prior visits to this and other
                                        websites (the DART cookie).</li>
                                    <li><strong className="text-slate-900">DART Cookie:</strong> Google's use of the DART cookie
                                        enables it to serve ads to our users based on their visit to YtShortsDL.net and
                                        other sites on the Internet.</li>
                                    <li>Users may opt out of the use of the DART cookie by visiting the <Link
                                        href="https://policies.google.com/technologies/ads" target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary-dark font-semibold underline">Google Ad
                                        and Content Network privacy policy</Link>.</li>
                                    <li>We do not control the cookies placed by third-party advertisers.</li>
                                </ul>
                                <p className="mt-4 text-slate-700 leading-relaxed">We may also use other third-party services
                                    like Google Analytics to understand site traffic and usage patterns. These services may
                                    also use cookies.</p>
                            </section>

                            <section id="children-privacy">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    3. Children’s Privacy (COPPA)</h2>
                                <p className="text-slate-700 leading-relaxed">YtShortsDL.net is not intended for use by anyone
                                    under the age of 13. We do not knowingly collect PII from children under 13. If we
                                    become aware that we have collected such data without parental consent, we will take
                                    steps to remove that information immediately.</p>
                            </section>

                            <section id="contact-info">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    4. Contact Us</h2>
                                <p className="text-slate-700 leading-relaxed">If you have any questions about this Privacy
                                    Policy or our data practices, please contact us:</p>
                                <p className="text-slate-700 leading-relaxed mt-2 bg-slate-100 p-4 rounded-lg inline-block">
                                    <strong>Email:</strong> <Link href="mailto:support@ytshortsdl.net"
                                        className="font-semibold text-primary hover:text-primary-dark underline">support@ytshortsdl.net</Link>
                                </p>
                            </section>
                        </div>
                    </article>
                </div>
            </section>
        </main>

    );
}