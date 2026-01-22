import { Metadata } from 'next';
import Mp3ToolSection from '@/components/Mp3ToolSection';
export const metadata: Metadata = {
    title: 'ShortsSync | Free YouTube Shorts to MP3 Downloader',
    description: 'Use the best YouTube Shorts Audio Downloader tool to convert any Shorts video to MP3 or M4A instantly. Simple, fast, and high-quality audio extraction.',
    alternates: {
        canonical: 'https://ytshortsdl.net/shorts-to-mp3',
    },
    openGraph: {
        title: 'ShortsSync | Free YouTube Shorts to MP3 Downloader',
        description: 'Use the best YouTube Shorts Audio Downloader tool to convert any Shorts video to MP3 or M4A instantly. Simple, fast, and high-quality audio extraction.',
        url: 'https://ytshortsdl.net/shorts-to-mp3',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Free YouTube Shorts to MP3 Downloader',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ShortsSync | Free YouTube Shorts to MP3 Downloader',
        description: 'Use the best YouTube Shorts Audio Downloader tool to convert any Shorts video to MP3 or M4A instantly. Simple, fast, and high-quality audio extraction.',
        images: ['https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};

export default function ShortsToMp3() {
    return (
        <main>
            <Mp3ToolSection />

            <section id="why-dedicated-tool" className="py-16 sm:py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50">
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                            <div>
                                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-5">Why Use a Dedicated MP3
                                    Downloader?</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">You’re not just downloading; you're
                                    extracting creative assets. A dedicated audio tool ensures you get clean sound without
                                    unnecessary video files, which is crucial for sound designers, remixers, and content
                                    creators.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                                <h3 className="font-display text-xl font-bold text-slate-800 mb-6">Key Benefits:</h3>
                                <ul className="space-y-5 text-lg">
                                    <li className="flex items-start"><i className="fas fa-check-circle text-primary mt-1.5 mr-3 text-xl"></i>
                                        <div><strong className="text-slate-800">Pure Audio Stream:</strong> We isolate the
                                            highest-fidelity audio track available.</div>
                                    </li>
                                    <li className="flex items-start"><i className="fas fa-check-circle text-primary mt-1.5 mr-3 text-xl"></i>
                                        <div><strong className="text-slate-800">Instant Conversion:</strong> Fast, browser-based
                                            conversion means zero waiting.</div>
                                    </li>
                                    <li className="flex items-start"><i className="fas fa-check-circle text-primary mt-1.5 mr-3 text-xl"></i>
                                        <div><strong className="text-slate-800">Zero Installation:</strong> Works on any device,
                                            from iPhone to Android.</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="quality-showdown" className="py-16 sm:py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50">
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                            <div>
                                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-5">Audio Quality Showdown: Why
                                    Bitrate Matters</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">Most generic converters grab a low-bitrate
                                    stream, leaving you with tinny sound at 128kbps. That won't cut it. We use the yt-dlp
                                    engine to target YouTube's highest available audio streams (up to 320kbps). This means
                                    cleaner bass, crisper highs, and no distortion in your projects. Stop settling for low
                                    quality.</p>
                            </div>
                            <div className="text-center bg-slate-50 p-8 rounded-xl border border-slate-200">
                                <div className="text-7xl font-extrabold font-poppins text-primary">320<span className="text-4xl text-slate-400 ml-2">kbps</span></div>
                                <p className="mt-2 font-semibold text-slate-600">Maximum Quality Target</p>
                                <div className="w-full bg-slate-200 h-2 rounded-full my-6">
                                    <div className="bg-primary h-2 rounded-full" ></div>
                                </div>
                                <p className="text-sm text-slate-500 italic">We prioritize the highest available bitrate to
                                    maintain audio fidelity for professional use.</p>
                            </div>
                        </div>
                        <div className="mt-12 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-left rounded-r-lg">
                            <h3 className="font-bold text-yellow-800">Fair Use and Copyright Notice</h3>
                            <p className="text-yellow-700 text-sm mt-1">Please ensure any downloaded audio is used in accordance
                                with YouTube's Terms of Service and applicable copyright laws (e.g., for personal remixing
                                or transformative work).</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}