
import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | YTShortsDL.net',
    description: 'Learn the story behind YTShortsDL.net. Discover our mission to build the ultimate toolkit for YouTube Shorts creators, from free downloads to advanced AI features.',
    alternates: {
        canonical: 'https://ytshortsdl.net/about', // Next.js 建议省略 .html 后缀
    },
    openGraph: {
        title: 'About Us | YTShortsDL.net',
        description: 'Learn the story behind YTShortsDL.net and our mission to build the ultimate toolkit for YouTube Shorts creators.',
        url: 'https://ytshortsdl.net/about',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'YTShortsDL.net About Us',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | YTShortsDL.net',
        description: 'Learn the story behind YTShortsDL.net and our mission to build the ultimate toolkit for YouTube Shorts creators.',
        images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};
export default function About() {
    return (
        <main>
            <section className="py-20 md:py-24 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    <article>
                        <h1
                            className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900 text-center">
                            Our Story: From Frustration to the Ultimate Creator Toolkit</h1>
                        <p className="mt-4 text-slate-500 text-lg text-center max-w-3xl mx-auto">We're a team of creators who
                            got tired of bad tools, so we built the one we always wanted.</p>

                        <div className="mt-16 space-y-16">
                            <section id="the-origin">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    The Origin: Built by Creators, for Creators</h2>
                                <p className="text-slate-700 leading-relaxed mb-4">YtShortsDL.net didn't start as a business
                                    plan; it
                                    started as a frustration. We are a small team of content creators who constantly
                                    struggled with the limitations of existing download tools. Every solution was either
                                    buggy, full of ads, or—worst of all—didn't provide the high-quality, clean files we
                                    needed for cross-platform repurposing.</p>
                                <p
                                    className="mt-6 p-6 bg-primary-light border-l-4 border-primary text-primary-dark rounded-r-lg font-medium leading-relaxed">
                                    <strong>Our Core Mission:</strong> To become the premier tool for creators to download,
                                    optimize, and reuse YouTube Shorts. We exist to solve the problems that other
                                    downloaders ignore.
                                </p>
                            </section>

                            <section id="the-vision">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    Our Value: Bridging Free Tools and Professional AI</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">We believe basic video downloading should
                                    always be fast and free. That’s our promise. But we realized that <strong>serious
                                        creators need more</strong> to save time and maintain quality when managing content
                                    across TikTok, Instagram, and other channels.</p>

                                <h3 className="text-xl font-bold text-slate-800 mb-3">The YtShortsDL.net Evolution:</h3>
                                <ul className="list-disc list-outside space-y-3 pl-6 text-slate-700">
                                    <li><strong>Phase 1: The Free Promise (The Foundation):</strong> Launching the cleanest,
                                        fastest YouTube Shorts downloader on the market.</li>
                                    <li><strong>Phase 2: AI Empowerment (The Value):</strong> Introducing our paid
                                        AI-powered
                                        services—features like the <strong>one-click Watermark Remover</strong> and
                                        <strong>4K/8K Lossless Downloads</strong>. These are the tools that transform
                                        content repurposing from a manual chore into an automated process.
                                    </li>
                                </ul>
                            </section>

                            <section id="meet-the-team">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    Our Commitment to Quality</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">YtShortsDL.net is maintained by a dedicated
                                    group of software developers and former marketing analysts who live and breathe digital
                                    content.</p>

                                <blockquote
                                    className="my-8 border-l-4 border-slate-300 pl-6 py-4 italic text-slate-600 relative">
                                    "We obsess over technical details—like why VP9 codecs matter for 4K and how Inpainting
                                    AI is the only way to truly remove a watermark without artifacts. We don't just use
                                    open-source APIs; we optimize them and build proprietary layers to guarantee the best
                                    quality output available anywhere."
                                    <cite className="block mt-4 text-right text-sm text-slate-500 font-semibold not-italic">—
                                        Lead Developer, YtShortsDL.net</cite>
                                </blockquote>

                                <p className="text-slate-700 leading-relaxed">Your success is our success. Every feature we
                                    build
                                    is designed to give you back time and ensure the quality of your content is never
                                    compromised.</p>
                            </section>

                            <section id="contact">
                                <h2
                                    className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                    Contact Us & Support</h2>
                                <p className="text-slate-700 leading-relaxed mb-6">We are dedicated to supporting our creator
                                    community. If you have questions about the tools, need help with your usage quota, or
                                    want
                                    to discuss a partnership, please reach out.</p>

                                <div className="bg-slate-100 p-6 rounded-lg">
                                    <h3 className="font-bold text-slate-800 text-lg">General Support & Inquiries:</h3>
                                    <p className="text-slate-600 mt-2">Email us at: <Link href="mailto:support@ytshortsdl.net"
                                        className="font-semibold text-primary hover:text-primary-dark underline">support@ytshortsdl.net</Link>
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1">We aim to respond to all inquiries within 24-48
                                        business hours.</p>
                                </div>
                            </section>

                            <section id="join-us" className="text-center pt-8">
                                <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4">Join the
                                    YtShortsDL.net Creator Community</h2>
                                <p className="text-slate-700 leading-relaxed mb-8 max-w-2xl mx-auto">We invite you to explore
                                    our advanced tools and see how YtShortsDL.net can streamline your creative workflow.</p>
                                <Link href="/pricing"
                                    className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-primary/40 text-lg">
                                    See Our AI Creator Suite Pricing &rarr;
                                </Link>
                            </section>

                        </div>
                    </article>
                </div>
            </section>
        </main>

    );
}