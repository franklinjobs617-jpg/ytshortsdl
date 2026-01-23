import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'YouTube Shorts Downloader iPhone - No App, Works on iOS!',
    description: 'The ultimate YouTube Shorts Downloader for iPhone users. Get clear 1080p files directly via browser. No need for complex iOS shortcuts or external apps. Safe and fast.',
    themeColor: '#EF4444',
    alternates: {
        canonical: 'https://ytshortsdl.net/guide/iphone-downloader',
    },
    openGraph: {
        title: 'YouTube Shorts Downloader iPhone - No App, Works on iOS!',
        description: 'The ultimate YouTube Shorts Downloader for iPhone users. Get clear 1080p files directly via browser. No need for complex iOS shortcuts or external apps. Safe and fast.',
        url: 'https://ytshortsdl.net/guide/iphone-downloader',
        type: 'website',
        images: [
            {
                url: 'https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png',
                width: 1200,
                height: 630,
                alt: 'YouTube Shorts Downloader iPhone',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'YouTube Shorts Downloader iPhone - No App, Works on iOS!',
        description: 'The ultimate YouTube Shorts Downloader for iPhone users. Get clear 1080p files directly via browser. No need for complex iOS shortcuts or external apps. Safe and fast.',
        images: ['https://ytshortsdl.net/ytshortsdl-youtube-video-mp3-downloader.png'],
    },
};

export default function IphoneDownloader() {
    return (
        <main>
            <section className="py-20 md:py-24 bg-white">
                <div className="container max-w-6xl mx-auto px-6">
                    <article className="space-y-16">
                        <h1
                            className="text-3xl md:text-5xl font-extrabold font-poppins leading-tight tracking-tighter text-slate-900 text-center">
                            The Best Way to Use a YouTube Shorts Downloader on iPhone (No App Needed)</h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
                            Finally, a solution that works flawlessly on <strong>iOS</strong> without forcing you to
                            download sketchy third-party apps or fiddling with unstable <strong>Shortcuts</strong>.
                            YtShortsDL.net works directly in your Safari browser.</p>

                        <div
                            className="p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-center max-w-3xl mx-auto">
                            <p className=" text-slate-700 mb-4 text-center">
                                Ready to try it? Please paste the link to the page below
                            </p>
                            <Link href="/" className="flex flex-col gap-3">
                                <button type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 whitespace-nowrap">
                                    Go Paste</button>
                            </Link>
                        </div>


                        <section id="guide">
                            <h2
                                className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-8 pb-2 border-b border-slate-200">
                                Step-by-Step Guide: Download Shorts Directly in Safari</h2>
                            <ol className="space-y-12">
                                <li className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800">Step 1: Copy the Short Link on Your iPhone
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed">Open the YouTube app, navigate to the Short,
                                        tap the 'Share' button, and select 'Copy Link.'</p>
                                </li>
                                <li className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800">Step 2: Paste and Convert in Safari</h3>
                                    <p className="text-slate-700 leading-relaxed">Open Safari, go to YtShortsDL.net, paste the
                                        link into the box above, and tap 'Download Video.'</p>
                                    <figure className="max-w-3xl mx-auto">
                                        <Image src="/blog/unnamed.jpg" width={400} height={400}
                                            alt="Screenshot guide for the iPhone showing where to paste the YouTube Shorts link in the Safari browser."
                                            className="w-full rounded-lg shadow-lg border border-slate-200" />
                                    </figure>
                                </li>
                                <li className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800">Step 3: Save the File to Your Files App
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed">This is the step most iPhone users mess up!
                                        After you tap 'Download' in the Safari prompt, look for the little downward arrow
                                        icon in your browser's toolbar (usually top right). Tap that arrow, then tap the
                                        downloaded video file name. This opens the Files App. Your video will be in the
                                        'Downloads' folder. From there, you must long-press the video file, select 'Share,'
                                        and then 'Save Video' to finally move it into your main Photos Library/Camera Roll.
                                        No app makes this part easier; this is just how iOS works.</p>

                                </li>
                            </ol>
                        </section>

                        <section id="shortcut-comparison">
                            <h2
                                className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                Addressing the Confusion: Why Our Browser Tool is Better Than an iOS Shortcut</h2>
                            <div className="text-slate-700 leading-relaxed space-y-4">
                                <p>
                                    Everyone searches for the perfect youtube short downloader shortcut until it inevitably
                                    breaks. Shortcuts rely on community developers keeping up with YouTube's constant API
                                    changes, leading to frustrating instability. Worse, they expose your device to potential
                                    risks and lock you out of high-end features. Our stable browser tool, specifically
                                    engineered for iOS optimization, bypasses all those shortcut pitfalls, guaranteeing a
                                    consistent, secure download experience every single time, even for our Pro 4K
                                    files.
                                </p>
                            </div>
                        </section>

                        <section id="4k-conversion" className="text-center">
                            <h2
                                className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                How to Get True 4K Quality on Your iPhone (The Pro Difference)</h2>
                            <p className="mt-4 max-w-3xl mx-auto text-slate-700 leading-relaxed">If you're reposting to
                                high-quality platforms or using the footage in a larger edit, 1080p often isn't enough. Our
                                Pro tool is the only way to get true, lossless 4K files directly to your
                                <strong>iPhone</strong>.
                            </p>
                            <figure className="my-8 max-w-3xl mx-auto">
                                <Image src="/blog/Conversion-Justification.jpg" width={400} height={400}
                                    alt="Side-by-side comparison on an iPhone screen showing the pixel difference between a standard 720p download and a crisp 4K Pro download."
                                    className="w-full rounded-lg shadow-xl border border-slate-200" />
                                <figcaption className="mt-3 text-center text-sm text-slate-500">The difference in clarity is
                                    essential for professional creators. Don't let compression ruin your high-quality
                                    source footage.</figcaption>
                            </figure>

                            <Link href="/pricing"
                                className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">Unlock
                                4K Downloads on iOS &rarr;</Link>
                        </section>

                        <section id="troubleshooting">
                            <h2
                                className="text-2xl md:text-3xl font-bold font-poppins text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                Troubleshooting Common iOS Download Issues</h2>
                            <div className="space-y-4">
                                <details className="p-4 border border-slate-200 rounded-lg">
                                    <summary className="font-semibold text-slate-800 cursor-pointer">Why didn't the file save to
                                        my Photos Library?</summary>
                                    <p className="mt-2 text-slate-700 leading-relaxed">On <strong>iOS</strong>, Safari saves all
                                        downloads to the default "Downloads" folder within the Files App first. You must
                                        manually move the video from there to your Photos Library if you want it to appear
                                        in your camera roll.</p>
                                </details>
                                <details className="p-4 border border-slate-200 rounded-lg">
                                    <summary className="font-semibold text-slate-800 cursor-pointer">Is there an App Store app?
                                    </summary>
                                    <p className="mt-2 text-slate-700 leading-relaxed">No, and that's the point! Our
                                        browser-based tool is safer and requires zero installation. Beware of look-alike
                                        apps in the App Store.</p>
                                </details>
                            </div>
                        </section>
                    </article>
                </div>
            </section>
        </main>
    );
}