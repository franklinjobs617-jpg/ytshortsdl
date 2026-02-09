import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free YouTube Shorts Thumbnail Downloader | HD, SD & MaxRes',
    description: 'Instantly download YouTube Shorts thumbnails in all available resolutions (HD, SD, Max). The fastest tool to grab the perfect cover image for your content.',
    alternates: {
        canonical: 'https://ytshortsdl.net/shorts-thumbnail-tool',
    },
    openGraph: {
        title: 'Free YouTube Shorts Thumbnail Downloader | HD, SD & MaxRes',
        description: 'Instantly download YouTube Shorts thumbnails in all available resolutions (HD, SD, Max). The fastest tool to grab the perfect cover image for your content.',
        url: 'https://ytshortsdl.net/shorts-thumbnail-tool',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Free YouTube Shorts Thumbnail Downloader',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free YouTube Shorts Thumbnail Downloader | HD, SD & MaxRes',
        description: 'Instantly download YouTube Shorts thumbnails in all available resolutions (HD, SD, Max). The fastest tool to grab the perfect cover image for your content.',
        images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};


export default function ShortsThumbnailTool() {
    return (

        <main>
            <div id="toast-container"
                className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none"></div>

            <section id="tool" className="relative text-center py-16 md:py-30 overflow-hidden">
                <div className="glow-effect"></div>
                <div
                    className="container max-w-5xl mx-auto px-4 relative z-10 md:bg-white md:border md:border-slate-200 md:backdrop-blur-md md:p-12 md:rounded-xl md:shadow-lg">

                    <h1
                        className="text-3xl md:text-5xl lg:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900">
                        Free YouTube Shorts <br /><span className="text-red-500">Thumbnail Downloader</span>
                    </h1>

                    <p className="mt-4 text-md md:text-lg text-slate-600 max-w-3xl mx-auto font-medium">
                        Paste any YouTube Shorts URL to view and download all available thumbnail sizes (HD, SD, MaxRes)
                        instantly.
                    </p>

                    <div className="mt-12 max-w-4xl mx-auto">
                        <form id="shorts-thumbnail-form">
                            <div
                                className="flex flex-col md:flex-row items-center bg-white p-2 rounded-xl custom-focus-ring transition-shadow duration-300 shadow-lg border border-slate-100">
                                <div className="relative w-full">
                                    <i className="fas fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    <input type="url" id="shorts-url" placeholder="Paste YouTube Shorts Link Here..."
                                        required
                                        className="w-full h-12 pl-10 pr-4 text-lg bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400" />
                                    <button type="button" id="clear-input"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 hidden">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6"
                                            fill="currentColor">
                                            <path
                                                d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c9.4-9.4 24.6-9.4 33.9 0l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9z" />
                                        </svg>
                                    </button>
                                </div>
                                <button type="submit" id="submit-btn"
                                    className="w-full md:w-auto mt-2 md:mt-0 bg-red-500 text-white font-bold text-lg px-6 py-3 rounded-lg flex-shrink-0 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-3"
                                >
                                    <i id="btn-icon" className="fas fa-images"></i>
                                    <span id="btn-text">Get Thumbnails</span>
                                    <div id="btn-loader" className="spinner hidden"></div>
                                </button>
                            </div>
                        </form>
                        <p id="input-help" className="mt-3 text-sm text-slate-500">Supports links like:
                            <code>youtube.com/shorts/...</code> or <code>youtu.be/...</code></p>
                        <p id="error-message" className="mt-3 text-sm text-red-600 font-bold hidden"></p>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest w-full mb-1">Other
                            Tools</span>
                        <Link href="/"
                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-full font-bold hover:border-red-500 transition-all shadow-sm text-slate-700 text-sm">
                            🎬 Download Video
                        </Link>
                        <Link href="/shorts-to-mp3"
                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-full font-bold hover:border-red-500 transition-all shadow-sm text-slate-700 text-sm">
                            🎵 Extract Audio
                        </Link>
                    </div>

                    <div id="thumbnail-output" className="hidden mt-16 transition-all duration-500">
                        <h2
                            className="text-2xl font-bold font-poppins text-slate-800 mb-8 text-left border-b border-slate-200 pb-4 flex justify-between items-baseline">
                            <span>Available Thumbnails</span>
                            <span id="video-id-display" className="text-sm font-mono font-normal text-slate-500 ml-2"></span>
                        </h2>

                        <div id="results-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        </div>
                    </div>
                </div>
            </section>

            <section id="why-dedicated" className="py-24 bg-slate-50 border-y border-slate-200/80">
                <div className="container max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/60">
                        <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-5">Why Use a Dedicated Thumbnail
                            Downloader?</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">Don't waste time taking blurry screenshots. A
                            dedicated tool accesses the official thumbnail files directly from YouTube's servers, giving you
                            the highest possible quality asset (up to 1280x720) without play buttons or overlays.</p>
                    </div>
                </div>
            </section>

            <section id="resolutions" className="py-24 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-poppins text-slate-900">All Resolutions: Find the Perfect Size
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-lg text-slate-500 leading-relaxed mb-6">
                                Bigger isn't always best. For small thumbnails or website embeds, smaller files load faster.
                                But for reposting to Instagram, Pinterest or blog headers, use the highest resolution.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mr-3 mt-0.5">
                                        <i className="fas fa-check text-red-500 text-sm"></i>
                                    </div>
                                    <div><strong className="text-slate-800 block text-lg">Maxres (1280x720)</strong> <span
                                        className="text-slate-600">Best for desktop backgrounds and high-quality
                                        editing.</span></div>
                                </li>
                                <li className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mr-3 mt-0.5">
                                        <i className="fas fa-check text-red-500 text-sm"></i>
                                    </div>
                                    <div><strong className="text-slate-800 block text-lg">High Quality (480x360)</strong> <span
                                        className="text-slate-600">Standard for most social media previews.</span></div>
                                </li>
                                <li className="flex items-start">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mr-3 mt-0.5">
                                        <i className="fas fa-check text-red-500 text-sm"></i>
                                    </div>
                                    <div><strong className="text-slate-800 block text-lg">Medium (320x180)</strong> <span
                                        className="text-slate-600">Ideal for smaller website widgets or email
                                        signatures.</span></div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-lg">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 aspect-video flex flex-col items-center justify-center p-2">
                                    <span className="text-red-500 font-bold text-lg">HD</span>
                                    <span className="text-xs text-slate-400">1280x720</span>
                                </div>
                                <div
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 aspect-[4/3] flex flex-col items-center justify-center p-2">
                                    <span className="text-slate-600 font-bold text-lg">HQ</span>
                                    <span className="text-xs text-slate-400">480x360</span>
                                </div>
                                <div
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 aspect-video flex flex-col items-center justify-center p-2">
                                    <span className="text-slate-500 font-bold text-sm">MQ</span>
                                    <span className="text-xs text-slate-400">320x180</span>
                                </div>
                                <div
                                    className="bg-white rounded-lg shadow-sm border border-slate-200 aspect-video flex flex-col items-center justify-center p-2">
                                    <span className="text-slate-500 font-bold text-sm">SD</span>
                                    <span className="text-xs text-slate-400">640x480</span>
                                </div>
                            </div>
                            <figcaption className="text-sm text-slate-500 italic mt-6 text-center">Visualizing relative aspect
                                ratios.</figcaption>
                        </div>
                    </div>
                </div>
            </section>

            <section id="full-video-cta" className="py-24 bg-slate-50 border-t border-slate-200/80">
                <div className="container mx-auto px-6 text-center">
                    <div
                        className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-12 rounded-2xl shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
                        <div
                            className="absolute -top-1/4 -right-1/4 w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-50">
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-white mb-4">Beyond the Thumbnail
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">Need the actual video file or audio track? Our main
                                downloader handles it all.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/"
                                    className="px-8 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1">
                                    Download Full Video &rarr;
                                </Link>
                                <Link href="/no-watermark"
                                    className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                                    Remove Watermark (AI) &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}