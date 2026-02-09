import { Metadata } from 'next';
import VideoToScriptToolSection from '@/components/VideoToScriptToolSection'; // 假设你的工具组件已重命名
import { FileText, Zap, Languages, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Free YouTube Video to Script Converter | Instant Transcript Generator',
    description: 'Effortlessly convert any YouTube video to a full, timestamped script with our free Video to Script Converter. Perfect for creators, researchers, and marketers to analyze and repurpose video content.',
    alternates: {
        canonical: 'https://ytshortsdl.net/video-to-script-converter', // 确保 URL 匹配
    },
    openGraph: {
        title: 'Free YouTube Video to Script Converter | Instant Transcript Generator',
        description: 'Effortlessly convert any YouTube video to a full, timestamped script with our free Video to Script Converter. Perfect for creators, researchers, and marketers to analyze and repurpose video content.',
        url: 'https://ytshortsdl.net/video-to-script-converter',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/images/og-video-to-script-converter.png', // 建议为该页面创建一个新的 OG 图片
                width: 1200,
                height: 630,
                alt: 'YouTube Video to Script Converter Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free YouTube Video to Script Converter | Instant Transcript Generator',
        description: 'Effortlessly convert any YouTube video to a full, timestamped script with our free Video to Script Converter. Perfect for creators, researchers, and marketers to analyze and repurpose video content.',
        images: ['https://ytshortsdl.net/images/og-video-to-script-converter.png'],
    },
};

export default function VideoToScriptConverterPage() {
    return (
        <main>
            {/* 假设 Mp3ToolSection 已被重构为更通用的工具组件 */}
            <VideoToScriptToolSection />

            <section id="why-use-converter" className="py-16  bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-slate-900 mb-6 leading-tight">
                                    Why Convert a YouTube Video to a Script?
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Manually transcribing a video is tedious and time-consuming. Our <strong>Video to Script Converter</strong>
                                    automates this process, providing you with a full, accurate transcript in seconds. This allows you to easily
                                    analyze, quote, and repurpose video content for blogs, social media, or academic research.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Key Advantages:</h3>
                                <ul className="space-y-6 text-lg">
                                    <li className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                                            <FileText size={18} />
                                        </div>
                                        <div><strong className="text-slate-800">Full Transcript Generation:</strong> Get the complete dialogue from any video, including auto-generated captions.</div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                                            <Zap size={18} />
                                        </div>
                                        <div><strong className="text-slate-800">Instant & Accurate:</strong> Powered by the robust AI engine for maximum speed and accuracy.</div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                                            <Languages size={18} />
                                        </div>
                                        <div><strong className="text-slate-800">Multi-Language Support:</strong> Extract scripts in English, Spanish, Japanese, and dozens of other languages.</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-improves-workflow" className="py-16 sm:py-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 items-center">
                            <div className="text-center bg-slate-50 p-8 rounded-2xl border border-slate-200/80 order-2 md:order-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Precision at Your Fingertips</h3>
                                <div className="text-7xl font-extrabold font-poppins text-red-600">100<span className="text-4xl text-slate-400 ml-2">%</span></div>
                                <p className="mt-2 font-semibold text-slate-600">Timestamp Accuracy</p>
                                <p className="text-sm text-slate-500 mt-6 italic">
                                    Every line of the script is timestamped, allowing you to quickly jump to the exact moment in the video.
                                </p>
                            </div>
                            <div className="order-1 md:order-2">
                                <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-slate-900 mb-6 leading-tight">
                                    Streamline Your Content Workflow
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                    A video script is a powerhouse for content repurposing. Turn a 10-minute video into a detailed blog post,
                                    pull out memorable quotes for Twitter, or translate the text to reach a global audience. Our tool makes it possible in just a few clicks.
                                </p>
                                <ul className="space-y-3 text-base">
                                    <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={16} className="text-green-500" /> Boost SEO with text-based content from videos.</li>
                                    <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={16} className="text-green-500" /> Create social media carousels from key points.</li>
                                    <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={16} className="text-green-500" /> Make your video content accessible to a wider audience.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-16 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-left rounded-r-lg flex items-start gap-4">
                            <AlertTriangle className="text-yellow-500 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-yellow-800">Copyright & Fair Use Disclaimer</h3>
                                <p className="text-yellow-700 text-sm mt-1">
                                    This tool is intended for personal use, research, and transformative work. Please respect copyright laws and
                                    YouTube's Terms of Service. Do not republish transcripts verbatim without permission.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}