import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '4K YouTube Shorts Downloader (Pro) | YTShortsdl.net',
    description: 'Unlock true 4K and 8K downloads for YouTube Shorts. Preserve original source quality for professional video editing and content repurposing with our Pro Creator Suite.',
    alternates: {
        canonical: 'https://ytshortsdl.net/4k-shorts-downloader', // Next.js 建议省略 .html 后缀
    },
    openGraph: {
        title: '4K YouTube Shorts Downloader (Pro) | YTShortsdl.net',
        description: 'Unlock true 4K and 8K downloads for YouTube Shorts. Preserve original source quality for professional video editing and content repurposing with our Pro Creator Suite.',
        images: ['/ytshortsdl-logo.webp'],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '4K YouTube Shorts Downloader (Pro) | YTShortsdl.net',
        description: 'Unlock true 4K and 8K downloads for YouTube Shorts. Preserve original source quality for professional video editing and content repurposing with our Pro Creator Suite.',
        images: ['/ytshortsdl-logo.webp'],
    },
};
export default function ShortsDownloader() {
    return (
        <main>
            <section className="relative py-16 md:py-30 text-center overflow-hidden border-b border-slate-200/80">
                <div className="glow-effect"></div>
                <div
                    className="container max-w-5xl mx-auto px-6 relative z-10 md:bg-white md:border md:border-slate-200 md:backdrop-blur-md md:p-12 md:rounded-xl md:shadow-lg">
                    <h1
                        className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900">
                        Unlock the Pro YouTube Shorts Downloader 4K
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">The highest quality shorts require a
                        professional toolkit. Access true high-quality assets instantly.</p>
                    <div className="mt-12 max-w-2xl mx-auto">
                        <div className="relative bg-white p-2 rounded-xl ring-1 ring-slate-200 opacity-60 cursor-not-allowed">
                            <div className="flex flex-col md:flex-row items-center">
                                <input type="url" placeholder="Paste Short Link Here..." disabled
                                    className="flex-grow w-full h-12 pl-4 pr-4 text-md bg-transparent focus:outline-none placeholder:text-slate-400" />
                                <select disabled
                                    className="appearance-none w-full md:w-auto h-12 pl-4 pr-10 text-md bg-transparent text-slate-800 font-medium focus:outline-none border-y-2 md:border-y-0 md:border-x-2 border-slate-200">
                                    <option>1080p (Free)</option>
                                    <option>4K UHD (PRO)</option>
                                </select>
                                <button disabled
                                    className="w-full md:w-auto mt-2 md:mt-0 bg-slate-300 text-slate-500 font-bold text-lg px-4 py-2 rounded-lg shrink-0 flex items-center justify-center space-x-3">
                                    <i className="fas fa-lock"></i><span>Download 4K</span>
                                </button>
                            </div>
                        </div>
                        <div className="text-center px-2 mt-8">
                            <p> Get 4K Access PLUS the AI Watermark Remover in one subscription!
                                <br />
                                <Link href="/pricing"
                                    className="font-bold text-xl text-primary underline hover:text-primary-dark">
                                    See Subscription Plans &rarr;
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="why-4k-matters" className="py-16">
                <div className="container max-w-5xl mx-auto px-6">
                    <div
                        className="bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 mb-5">Why 4K Quality is
                            Non-Negotiable for
                            Professional Creators</h2>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">If you edit videos for clients
                            or aim for cinematic quality, 1080p assets introduce artifacts, blurriness, and a lack of detail
                            when you zoom, crop, or re-encode. 4K downloads preserve the raw source quality, ensuring your
                            final edit looks flawless.</p>
                    </div>
                </div>
            </section>

            <section id="quality-comparison" className="py-16 bg-white border-y border-slate-200/80">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 mb-8">4K vs. 1080p: The
                            Difference is
                            Clear</h2>
                        <div className="flex flex-col items-center">
                            {/* 注意：img-comparison-slider 是 Web Component，Image 组件在其中需要处理 slot */}
                            {/* <img-comparison-slider className="rounded-xl shadow-lg border border-slate-200 w-full max-w-3xl">
                                <Image
                                    slot="first"
                                    src="/youtube-shorts-1080p-standard-quality.jpg"
                                    alt="Standard 1080p YouTube Short screenshot"
                                    width={800}
                                    height={450}
                                    priority
                                />
                                <Image
                                    slot="second"
                                    src="/youtube-shorts-4k-uhd-pro-quality.png"
                                    alt="4K UHD YouTube Short screenshot"
                                    width={800}
                                    height={450}
                                    priority
                                />
                            </img-comparison-slider> */}
                            <figcaption className="text-sm text-slate-500 italic mt-4">Slide to see the difference! Zero
                                artifacts, perfect background restoration.</figcaption>
                        </div>
                        <figcaption className="text-sm text-slate-500 italic mt-4">The quality difference is visible, especially
                            on larger screens. Don't risk low-quality content.</figcaption>
                    </div>
                </div>
            </section>

            <section id="technical-advantage" className="py-16">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 mb-5">The Technical
                                Advantage:<br />How
                                We Achieve True 4K</h2>
                            <p className="text-lg text-slate-700 leading-relaxed max-w-4xl mx-auto p-4 ">
                                The biggest difference isn't just the pixel count—it's the <strong>bitrate</strong> and
                                <strong>codec</strong>. When you use
                                the free 1080p tool, you usually get an AVC stream with a lower bitrate, causing
                                noticeable <strong>compression artifacts</strong> when you zoom or re-upload. Our 4K
                                downloads aggressively
                                target the superior <strong>VP9</strong> or <strong>AV1</strong> streams. The file size is
                                significantly larger, sure, but
                                that means every time you edit, your source file <strong>retains its original
                                    integrity</strong>. For
                                professional <strong>color grading</strong> or zooming in on a small detail, this is the
                                <strong className="text-red-600">only way to go</strong>.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60">
                            <div className="flex items-center justify-around gap-2">
                                <div className="text-center p-4"><i className="fas fa-film text-4xl text-primary"></i>
                                    <p className="text-xs font-bold mt-2">VP9/AV1</p>
                                </div>
                                <i className="fas fa-plus text-slate-300 text-2xl"></i>
                                <div className="text-center p-4"><i className="fas fa-music text-4xl text-primary"></i>
                                    <p className="text-xs font-bold mt-2">Opus</p>
                                </div>
                                <i className="fas fa-equals text-slate-300 text-2xl"></i>
                                <div className="text-center p-4"><i className="fas fa-video text-4xl text-primary"></i>
                                    <p className="text-sm font-bold mt-2">True 4K File</p>
                                </div>
                            </div>
                            <figcaption className="text-sm text-slate-500 italic mt-4 text-center">We leverage lossless muxing
                                of separate video and audio streams to preserve original quality.</figcaption>
                        </div>
                    </div>
                </div>
            </section>

            <section id="unlock-guide" className="py-16 bg-white border-y border-slate-200/80">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 items-center">
                        <div className="bg-slate-800 text-white p-6 rounded-2xl text-center shadow-2xl">
                            <h3 className="text-2xl font-bold font-poppins mb-4">The 4K Tool is Part of the AI Creator Suite
                            </h3>
                            <div className="text-lg text-slate-300 leading-relaxed mb-6">
                                Low quality costs you clients and time. The <strong>Pro Creator subscription</strong> is an
                                <strong>investment</strong>, not an expense. Get <strong>4K</strong> downloads and the
                                <strong>AI Watermark Remover</strong> instantly. Stop paying for multiple tools. This is the
                                only toolkit you need for stunning, professional short-form content.
                            </div>
                            <Link href="/pricing"
                                className="inline-block px-8 py-3 bg-primary text-white font-bold text-lg rounded-lg shadow-lg hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-1">
                                Start Your Subscription Now &rarr;
                            </Link>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold font-poppins text-slate-900 mb-8">How to Unlock the 4K
                                Downloader
                            </h2>
                            <ol className="space-y-6">
                                <li className="flex items-start text-lg">
                                    <span className="flex items-center justify-center w-8 h-8 mr-4 bg-primary text-white font-bold rounded-full shrink-0">1</span>
                                    <div><strong className="text-slate-800">Choose Your Plan:</strong> Select the Creator Suite Subscription.</div>
                                </li>
                                <li className="flex items-start text-lg">
                                    <span className="flex items-center justify-center w-8 h-8 mr-4 bg-primary text-white font-bold rounded-full shrink-0">2</span>
                                    <div><strong className="text-slate-800">Access the Pro Tool:</strong> Log in and this page will be unlocked.</div>
                                </li>
                                <li className="flex items-start text-lg">
                                    <span className="flex items-center justify-center w-8 h-8 mr-4 bg-primary text-white font-bold rounded-full shrink-0">3</span>
                                    <div><strong className="text-slate-800">Download in 4K:</strong> Paste your link and select the 4K option.</div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section >
        </main >
    );
}