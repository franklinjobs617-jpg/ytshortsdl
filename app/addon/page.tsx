
import Link from "next/link";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Browser Add-On Extension | YTShortsDL',
    description: 'Install the YTShortsDL browser add-on for Firefox, Edge, or Opera. The fastest way to download YouTube Shorts videos without copy-pasting links.',
    alternates: {
        canonical: 'https://ytshortsdl.net/addon',
    },
    openGraph: {
        title: 'Official Browser Add-On | YTShortsDL',
        description: 'Install the YTShortsDL browser add-on. The fastest way to download YouTube Shorts videos without copy-pasting links.',
        url: 'https://ytshortsdl.net/addon',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'Official Browser Add-On | YTShortsDL',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Official Browser Add-On | YTShortsDL',
        description: 'Install the YTShortsDL browser add-on. The fastest way to download YouTube Shorts videos without copy-pasting links',
        images: ['https://ytshortsdl.net/images/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};

export default function Addon() {
    return (
        <main className="pb-20 pt-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-xl p-8 md:p-12 border border-slate-200/80">

                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 text-center">
                        YTShorts<span className="text-red-500">DL</span> Browser Add-On
                    </h1>

                    <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
                        To <Link href="/" className="text-red-600 hover:underline font-medium">download YouTube Shorts
                            videos</Link> even faster, simply install our official add-on. Stop copying and pasting links
                        manually—integrate the downloader directly into your browser.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-8 mb-12 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Select Your Browser</h3>

                        <div className="flex flex-col gap-4 max-w-md mx-auto">
                            <Link href="https://addons.mozilla.org/en-US/firefox/addon/snapshorts-pro/?utm_source=addons.mozilla.org"
                                className="group relative block w-full" target="_blank" rel="noopener noreferrer">
                                <div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-200 blur opacity-30">
                                </div>
                                <button
                                    className="relative w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white bg-slate-900 rounded-lg group-hover:bg-slate-800 transition duration-200">
                                    <i className="fab fa-firefox text-2xl text-orange-500"></i>
                                    <span>Add to Firefox</span>
                                </button>
                            </Link>


                            <Link href="https://microsoftedge.microsoft.com/addons/detail/snapshorts-pro/nnbcjohhcadiifdipphkmldbgeikchjo"
                                className="group relative block w-full" target="_blank" rel="noopener noreferrer">
                                <div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-200 blur opacity-30">
                                </div>
                                <button
                                    className="relative w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-white bg-slate-900 rounded-lg group-hover:bg-slate-800 transition duration-200">
                                    <i className="fab fa-edge text-2xl text-orange-500"></i>
                                    <span>Add to Edge</span>
                                </button>
                            </Link>
                            <button
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-bold text-slate-400 bg-slate-100 rounded-lg border border-slate-200 cursor-not-allowed">
                                <i className="fab fa-opera text-2xl"></i>
                                <span>Add to Opera (Coming Soon)</span>
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-4">
                            You will be redirected to the official add-on installation page.
                        </p>
                    </div>


                    <div className="space-y-8 text-slate-700">

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use the Add-On</h2>
                            <p className="mb-4 leading-relaxed">
                                Once you install the add-on, you will see an additional icon next to your browser's address
                                bar. This small yet powerful tool connects your browsing experience directly to our
                                high-speed conversion servers.
                            </p>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-800 font-bold">Important Tip:</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Please note that in some browsers (especially Chrome and Edge), new extensions
                                            are hidden by default. You may need to click the "Puzzle Piece" icon in your
                                            toolbar and <strong>pin the add-on icon</strong> to keep it permanently visible
                                            for easy access.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="leading-relaxed">
                                From then on, the process is completely automated. Every time you are watching a YouTube
                                Shorts video that you wish to save:
                            </p>
                            <ol className="list-decimal list-inside mt-3 space-y-2 ml-2">
                                <li>Locate the <strong>SnapShorts</strong> icon in your toolbar.</li>
                                <li>Simply <strong>click on the add-on icon</strong>.</li>
                                <li>You will be instantly redirected to our website.</li>
                                <li>The video URL is automatically processed, and the video is converted to a high-quality
                                    MP4 file ready for download.</li>
                            </ol>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Install the Add-On?</h2>
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                    <i className="fas fa-bolt text-red-500 mt-1"></i>
                                    <span><strong>Instant Access:</strong> No need to copy URL, open a new tab, paste, and
                                        click convert. It happens in one click.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                    <i className="fas fa-shield-alt text-red-500 mt-1"></i>
                                    <span><strong>Secure & Safe:</strong> Our extension is reviewed by browser stores and
                                        contains no tracking code.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                    <i className="fas fa-video text-red-500 mt-1"></i>
                                    <span><strong>Best Quality:</strong> Automatically fetches the highest resolution
                                        available for the Short.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                    <i className="fas fa-sync text-red-500 mt-1"></i>
                                    <span><strong>Always Updated:</strong> We maintain the add-on to ensure compatibility
                                        with the latest YouTube changes.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mt-8">
                            <p className="text-sm text-slate-500 mb-4">
                                As soon as the conversion is finished, you can download your converted YouTube Shorts video.
                                By using our Add-On, you accept our <Link href="/terms"
                                    className="text-red-600 hover:underline">Terms of Use</Link>.
                            </p>

                            <div
                                className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <span className="text-slate-700 text-sm font-medium">Having trouble installing or using the
                                        extension?</span>
                                </div>
                                <Link href="/support"
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap">
                                    Visit Support Center &rarr;
                                </Link>
                            </div>

                            <p className="text-sm text-slate-600 bg-slate-100 p-4 rounded-lg inline-block w-full">
                                <strong>Prefer no installation?</strong> If you prefer not to install an Add-On or are on a
                                public computer, you can try our <Link href="/bookmarklet"
                                    className="text-red-600 hover:underline font-bold">YouTube Shorts Bookmarklet</Link> instead.
                                It provides similar functionality without a permanent installation.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>

    );
}