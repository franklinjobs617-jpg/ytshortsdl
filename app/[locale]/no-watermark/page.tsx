import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'YouTube Shorts Downloader Without Watermark | AI Remover Tool',
    description: 'Stop manually editing! Use our AI Watermark Remover to get clean videos for cross-posting. The best YouTube Shorts Downloader without watermark solution.',
    alternates: {
        canonical: 'https://ytshortsdl.net/no-watermark',
    },
    openGraph: {
        title: 'YouTube Shorts Downloader Without Watermark | AI Remover Tool',
        description: 'Stop manually editing! Use our AI Watermark Remover to get clean videos for cross-posting. The best YouTube Shorts Downloader without watermark solution.',
        url: 'https://ytshortsdl.net/no-watermark',
        type: 'article',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'YouTube Shorts Downloader Without Watermark | AI Remover Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'YouTube Shorts Downloader Without Watermark | AI Remover Tool',
        description: 'Stop manually editing! Use our AI Watermark Remover to get clean videos for cross-posting. The best YouTube Shorts Downloader without watermark solution.',
        images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};

export default function ShortsToMp3() {
    return (
        <main>
            <section className="relative py-12 text-center overflow-hidden">
                <div className="glow-effect"></div>
                <div className="container  mx-auto px-6 relative z-10">

                    <h1 className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900">
                        The Ultimate YouTube Shorts Downloader<br className="hidden md:block" /> Without Watermark (AI Powered)
                    </h1>
                    <p className="mt-4 text-md text-slate-600 max-w-3xl mx-auto">Erase the watermark and make your Shorts
                        instantly cross-platform ready.</p>

                    <div className="mt-6 w-full max-w-5xl mx-auto ">

                        <div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="the-problem" className="container mx-auto px-6 py-16 space-y-16">
                <div className="p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50 text-center bg-white">
                    <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-5">The Creator's Problem: The Watermark
                        Barrier
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed">Every professional creator knows: you can't post a
                        YouTube-branded video directly to TikTok or Instagram Reels. It looks lazy, limits your reach, and
                        can
                        negatively affect platform algorithms. The watermark is your biggest barrier to effortless
                        cross-posting.</p>
                </div>
            </section>

            <article id="ai-solution" className="container mx-auto px-6 pb-16 space-y-16 ">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50 grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-5">How Our AI Watermark Remover Works
                        </h2>
                        <div className="text-center pb-4">
                            <div className="text-6xl font-extrabold font-poppins text-primary">98%</div>
                            <p className="mt-1 font-semibold text-slate-600">Flawless Removal Rate</p>
                            <p className="text-sm text-slate-500 mt-2">Tested on thousands of Shorts, our system adapts to
                                different textures, lighting, and backgrounds.</p>
                        </div>
                        <p className="text-md text-slate-600 leading-relaxed">
                            Simply put, video watermark removal is <strong>extremely resource-intensive</strong> from an
                            engineering perspective. It's not like still images; video demands a dedicated <strong>GAN
                                framework</strong> for temporal continuity. That's why a 10 second clip requires
                            high-performance computing, but ensures a <strong>ready-to-use</strong> social media quality
                            output.

                        </p>

                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">

                        <ol className="space-y-4">
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-light rounded-lg mr-4">
                                    <i className="fas fa-crosshairs text-primary"></i>
                                </div>
                                <div><strong className="text-slate-800">1. Masking:</strong> The AI precisely identifies the
                                    watermark area.</div>
                            </li>
                            <li className="flex justify-center my-2"><i className="fas fa-arrow-down text-slate-300"></i></li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-light rounded-lg mr-4">
                                    <i className="fas fa-fill-drip text-primary"></i>
                                </div>
                                <div><strong className="text-slate-800">2. Inpainting:</strong> It intelligently reconstructs
                                    the pixels behind it.</div>
                            </li>
                            <li className="flex justify-center my-2"><i className="fas fa-arrow-down text-slate-300"></i></li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-light rounded-lg mr-4">
                                    <i className="fas fa-check-double text-primary"></i>
                                </div>
                                <div><strong className="text-slate-800">3. Final Output:</strong> A clean, artifact-free video
                                    is generated.</div>
                            </li>
                        </ol>
                    </div>
                </div>
            </article>

            <section className="container mx-auto px-6 pb-16 space-y-16 ">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50">
                    <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-8 text-center">AI vs. Manual Cropping:
                        The Cost
                        of Wasted Time</h2>

                    <div className="grid md:grid-cols-2 gap-8 items-center border border-slate-200 rounded-xl p-8">

                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <i className="fas fa-clock text-3xl text-slate-400"></i>
                                <h3 className="text-xl font-bold text-slate-500">The Manual Way</h3>
                            </div>
                            <p className="text-slate-500">Spend 15-30 minutes per video fighting with editing software, manually
                                cropping and repositioning to hide the watermark.</p>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <i className="fas fa-wand-magic-sparkles text-3xl text-primary"></i>
                                <h3 className="text-xl font-bold text-primary">The AI Way</h3>
                            </div>
                            <p className="text-slate-800 font-medium">Get a perfect, clean video in 2 seconds. Reinvest your
                                saved
                                time into creating your next viral idea.</p>
                        </div>

                    </div>

                    <p className="text-lg text-slate-600 leading-relaxed mt-8 max-w-3xl mx-auto text-center">Your time is worth
                        more
                        than the cost of a few AI credits. If you're serious about building your brand, automate the
                        headache.
                        Get your content posted instantly while the trend is still hot.</p>
                </div>
            </section>
            <section className="container mx-auto px-6 pb-16 space-y-16 ">

                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 mb-4">Stop Using Shady
                            Extensions: Safety
                            &amp;
                            Speed Matter</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">Choose a professional, browser-based solution
                            over
                            risky third-party extensions. Your security is non-negotiable.</p>
                    </div>

                    <div className="mt-12 grid md:grid-cols-2 gap-8">

                        <div className="bg-red-50/50 p-8 rounded-xl border-2 border-dashed border-red-200">
                            <div className="flex items-center gap-4">
                                <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
                                <h3 className="text-2xl font-bold text-red-700">Shady Extensions</h3>
                            </div>
                            <p className="text-red-900/80 mt-4 mb-6">Many 'free' removers force you to install browser
                                extensions,
                                which are often vectors for malware and data tracking.</p>
                            <ul className="space-y-3 text-red-900/80">
                                <li className="flex items-start"><i className="fas fa-times-circle text-red-400 mt-1 mr-3"></i><span>High risk of malware
                                    and
                                    spyware.</span></li>
                                <li className="flex items-start"><i className="fas fa-times-circle text-red-400 mt-1 mr-3"></i><span>Can
                                    track your browsing data.</span></li>
                                <li className="flex items-start"><i className="fas fa-times-circle text-red-400 mt-1 mr-3"></i><span>Unreliable and
                                    frequently
                                    break.</span></li>
                            </ul>
                        </div>

                        <div className="bg-green-50/50 p-8 rounded-xl border-2 border-green-200">
                            <div className="flex items-center gap-4">
                                <i className="fas fa-shield-halved text-3xl text-green-600"></i>
                                <h3 className="text-2xl font-bold text-green-800">ShortsSync Secure Tool</h3>
                            </div>
                            <p className="text-green-900/80 mt-4 mb-6">Our tool is 100% web-based, secure, and requires no
                                installation. It’s the safest alternative to the unreliable extension market.</p>
                            <ul className="space-y-3 text-green-900/80">
                                <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i><span><strong>100%
                                    Web-Based:</strong> Nothing to install.</span></li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i><span><strong>Guaranteed
                                    Privacy:</strong> We never see your data.</span></li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i><span><strong>Professionally
                                    Maintained:</strong> Always fast &amp; reliable.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <article id="pricing" className="text-center pt-16">
                <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 mb-4">Pricing and Access: Get Your
                    Clean Videos
                    Instantly</h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">The AI Watermark Remover is a premium
                    service available via Credits or Subscription, priced based on the high computing power required for
                    each video.</p>
                <div className="max-w-5xl mx-auto  my-5 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-lg font-medium">

                    <Image src="/by yt.png" alt="" className="block h-full w-full" width={400} height={100} />


                </div>
                <p className="text-sm text-slate-500 italic pb-8 block">The cost of one credit is less than the hourly
                    wage
                    you save on manual editing.</p>
                <Link href="/pricing" className="block max-w-fit mx-4 md:mx-auto px-8 py-4 bg-primary text-white font-bold text-lg rounded-lg shadow-lg hover:bg-primary-dark transition-all duration-300 transform ">
                    Buy Credits &amp; Start Removing Watermarks →
                </Link>
            </article>

        </main>
    )
}