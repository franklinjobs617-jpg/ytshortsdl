import Link from "next/link"
import Image from 'next/image'

export function StaticContent() {
    return (
        <>
            <section className="py-8 bg-white border-y border-slate-200/80">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="font-bold text-2xl text-slate-800 mb-8 text-center md:text-left">
                        Simple 3-Step Guide to Convert Shorts to MP3
                    </h2>
                    <div className="pt-8">
                        <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 relative">
                            <div className="flex-1 flex items-start space-x-4 md:flex-col md:space-x-0 md:items-center text-center">
                                <div className="md:mt-4">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">1. Copy the Link</h3>
                                    <p className="text-slate-600 text-left md:text-center">Find the YouTube Short video you need and copy its URL.</p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="text-3xl text-slate-300" width="24" height="24" fill="currentColor">
                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                </svg>
                            </div>

                            <div className="flex-1 flex items-start space-x-4 md:flex-col md:space-x-0 md:items-center text-center">
                                <div className="md:mt-4">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">2. Select MP3</h3>
                                    <p className="text-slate-600 text-left md:text-center">Paste the URL into the box above and ensure 'MP3' is selected.</p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="text-3xl text-slate-300" width="24" height="24" fill="currentColor">
                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                </svg>
                            </div>

                            <div className="flex-1 flex items-start space-x-4 md:flex-col md:space-x-0 md:items-center text-center">
                                <div className="md:mt-4">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">3. Download</h3>
                                    <p className="text-slate-600 text-left md:text-center">Hit the button. The high-quality audio file is saved instantly to your device.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 bg-slate-100">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900 mb-5">The Fastest and Most<br />Secure Shorts Download Experience</h2>
                            <h3 className="text-xl font-semibold text-slate-700 mb-8">Our promise: Always faster and more reliable than the competition.</h3>
                            <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-xl border-l-4 border-red-500">
                                <strong className="text-3xl md:text-4xl font-extrabold font-poppins text-red-500">23%</strong>
                                <p className="text-slate-600 font-medium leading-tight">Faster average conversion time than top competitors (e.g., Savetube & Y2mate).</p>
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-6">We developed ShortsSync because other tools on the market were too slow or unreliable. Our custom protocol ensures maximum speed through:</p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="text-red-500 mt-1 mr-4" width="16" height="16" fill="currentColor">
                                        <path d="M256 0c17.7 0 32 14.3 32 32l0 128 64 0c15.8 0 28.5 11.2 31.4 26.6s-9.9 29.8-25.4 34.6l-224 80c-15.6 5.6-33.1 .5-42.5-12.4s-10.2-29.9-1.8-44.1l64-106.7L96 160c-15.8 0-28.5-11.2-31.4-26.6s9.9-29.8 25.4-34.6l224-80c15.6-5.6 33.1-.5 42.5 12.4s10.2 29.9 1.8 44.1L256 160 256 0z" />
                                    </svg>
                                    <div><strong className="text-slate-800">Priority Link Parsing:</strong> We process your link instantly, with no waiting time.</div>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="text-red-500 mt-1 mr-4" width="16" height="16" fill="currentColor">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                                    </svg>
                                    <div><strong className="text-slate-800">Invasive Ad Blocking:</strong> No heavy ad scripts means a smoother experience for you.</div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-linear-to-br from-red-500 to-orange-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
                                <Image src="/Promise.webp" alt="A visual promise of speed and reliability" className="rounded-xl w-full transition-transform duration-500 group-hover:scale-105" width={400} height={400} />
                                <div className="absolute -bottom-5 -right-5 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-xl">
                                    <figcaption className="text-sm text-slate-600 italic font-medium">Trust speed, not just promises.</figcaption>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container max-w-6xl mx-auto px-6 space-y-24">
                    <div className="grid md:grid-cols-1 gap-8 items-center">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900 mb-5">Supported Formats:<br />MP4, MP3, and HD Quality</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-10">We don't just download; we ensure your videos meet all content repurposing requirements.</p>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-transparent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20 hover:border-red-500/30">
                                    <div className="w-16 h-16 mb-6 flex items-center justify-center bg-red-100 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="text-3xl text-red-500" width="30" height="30" fill="currentColor">
                                            <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">High-Quality MP4</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Download in Standard HD or Full HD. For higher quality, check our{" "}
                                        <Link href="/4k-shorts-downloader" className="text-red-500 font-semibold hover:underline">
                                            4K/8K Pro Options
                                        </Link>.
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-transparent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-red-500/20 hover:border-red-500/30">
                                    <div className="w-16 h-16 mb-6 flex items-center justify-center bg-red-100 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="text-3xl text-red-500" width="30" height="30" fill="currentColor">
                                            <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">MP3 Audio Extraction</h3>
                                    <p className="text-slate-600 leading-relaxed">Instantly separate the audio track for remixes or sound design, without any extra conversion tools.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900 mb-5">Why an Online Tool Over an<br />Extension or App?</h2>
                            <p className="text-slate-600 text-lg leading-relaxed">Security, speed, and simplicity are key. Here's why our online tool is the future of content repurposing:</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60">
                            <ul className="space-y-6">
                                <li className="flex items-start">
                                    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg mr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="text-xl text-orange-500" width="20" height="20" fill="currentColor">
                                            <path d="M128 320L24.5 320c-24.9 0-40.2-27.1-27.4-48.5L50 183.3C58.7 168.8 74.3 160 91.2 160l95 0c76.1-128.9 189.6-135.4 265.5-124.3 12.8 1.9 22.8 11.9 24.6 24.6 11.1 75.9 4.6 189.4-124.3 265.5l0 95c0 16.9-8.8 32.5-23.3 41.2l-88.2 52.9c-21.3 12.8-48.5-2.6-48.5-27.4L192 384c0-35.3-28.7-64-64-64l-.1 0zM400 160a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Zero Installation, Instant Start</h3>
                                        <p className="text-slate-600 leading-relaxed mt-1">No malware or browser plugins. Just a clean, fast tool that works instantly.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg mr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="text-xl text-orange-500" width="20" height="20" fill="currentColor">
                                            <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Universal Compatibility</h3>
                                        <p className="text-slate-600 leading-relaxed mt-1">Works seamlessly on iOS, Android, PC, and Mac. No need for a dedicated app download.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg mr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="text-xl text-orange-500" width="20" height="20" fill="currentColor">
                                            <path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l251.5 0C261 469.4 240 414.5 240 356.4l0-31.1c0-7.3 1-14.5 2.9-21.3l-48.6 0zm251 184.5l-13.3 6.3 0-188.1 96 32 0 19.6c0 55.8-32.2 106.5-82.7 130.3zM421.9 259.5l-112 37.3c-13.1 4.4-21.9 16.6-21.9 30.4l0 31.1c0 74.4 43 142.1 110.2 173.7l18.5 8.7c4.8 2.2 10 3.4 15.2 3.4s10.5-1.2 15.2-3.4l18.5-8.7C533 500.3 576 432.6 576 358.2l0-31.1c0-13.8-8.8-26-21.9-30.4l-112-37.3c-6.6-2.2-13.7-2.2-20.2 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Guaranteed Privacy</h3>
                                        <p className="text-slate-600 leading-relaxed mt-1">Server-side processing means we <strong>never</strong> touch, view, or store your files.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50 border-y border-slate-200/80">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900">Go Beyond Downloading with AI</h2>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed">Unlock our Creator Suite to optimize and repurpose your content like never before.</p>
                    </div>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 divide-y divide-slate-200">
                        <div className="p-8 grid md:grid-cols-[auto_1fr_auto] items-center gap-6 hover:bg-slate-50 transition-colors duration-300">
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-red-100 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="text-2xl text-red-500" width="24" height="24" fill="currentColor">
                                    <path d="M263.4-27L278.2 9.8 315 24.6c3 1.2 5 4.2 5 7.4s-2 6.2-5 7.4L278.2 54.2 263.4 91c-1.2 3-4.2 5-7.4 5s-6.2-2-7.4-5L233.8 54.2 197 39.4c-3-1.2-5-4.2-5-7.4s2-6.2 5-7.4L233.8 9.8 248.6-27c1.2-3 4.2-5 7.4-5s6.2 2 7.4 5zM110.7 41.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7L59.8 164.2 9.7 142.7C3.8 140.2 0 134.4 0 128s3.8-12.2 9.7-14.7L59.8 91.8 81.3 41.7C83.8 35.8 89.6 32 96 32s12.2 3.8 14.7 9.7zM464 304c6.4 0 12.2 3.8 14.7 9.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7l-21.5-50.1-50.1-21.5c-5.9-2.5-9.7-8.3-9.7-14.7s3.8-12.2 9.7-14.7l50.1-21.5 21.5-50.1c2.5-5.9 8.3-9.7 14.7-9.7zM460 0c11 0 21.6 4.4 29.5 12.2l42.3 42.3C539.6 62.4 544 73 544 84s-4.4 21.6-12.2 29.5l-88.2 88.2-101.3-101.3 88.2-88.2C438.4 4.4 449 0 460 0zM44.2 398.5L308.4 134.3 409.7 235.6 145.5 499.8C137.6 507.6 127 512 116 512s-21.6-4.4-29.5-12.2L44.2 457.5C36.4 449.6 32 439 32 428s4.4-21.6 12.2-29.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">AI Watermark Remover</h3>
                                <p className="text-slate-600 leading-relaxed">Instantly remove watermarks for seamless cross-platform sharing.</p>
                            </div>
                            <Link href="/no-watermark" className="px-5 py-2 text-center font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group flex items-center">
                                Learn More{" "}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" width="14" height="14" fill="currentColor">
                                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                </svg>
                            </Link>
                        </div>
                        <div className="p-8 grid md:grid-cols-[auto_1fr_auto] items-center gap-6 hover:bg-slate-50 transition-colors duration-300">
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-red-100 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="text-2xl text-red-500" width="24" height="24" fill="currentColor">
                                    <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">Transcript Generator</h3>
                                <p className="text-slate-600 leading-relaxed">Get the full text of any Short for instant blog posts or captions.</p>
                            </div>
                            <Link href="/pricing" className="px-5 py-2 text-center font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 group flex items-center">
                                Get Transcript{" "}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" width="14" height="14" fill="currentColor">
                                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5-32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section >

            <section className="py-24 bg-slate-50 border-y border-slate-200/80">
                <div className="container max-w-4xl mx-auto px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="text-5xl text-slate-300 inline-block" width="48" height="48" fill="currentColor">
                        <path d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z" />
                    </svg>
                    <blockquote className="mt-6">
                        <p className="text-xl md:text-2xl font-medium text-slate-800 italic leading-relaxed">
                            "YTShortsDL is a lifesaver. The AI watermark remover saves me at least 2 hours every week. It's not an expense; it's an investment in my workflow."
                        </p>
                    </blockquote>
                    <figcaption className="mt-8">
                        <p className="font-bold text-lg text-slate-900">Alex P., Social Media Manager</p>
                        <p className="text-sm text-slate-500">Pragmatic Creator</p>
                    </figcaption>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <div className="bg-linear-to-r from-slate-800 to-slate-900 text-white p-12 rounded-2xl shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-1/4 -right-1/4 w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-white">Stop Just Downloading. Start Creating.</h2>
                            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">Unlock the full potential of your content. Go from a simple video to a multi-platform asset with our AI-powered Creator Suite.</p>
                            <Link href="/pricing" className="mt-10 inline-block bg-red-500 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/40">
                                Explore the AI Suite
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="py-24 border-t border-slate-200/80 bg-white">
                <div className="container max-w-5xl mx-auto px-6  ">
                    <h2 className="text-3xl md:text-4xl font-bold font-poppins text-slate-900 mb-10">Frequently Asked Questions (FAQ)</h2>
                    <div className="space-y-4">
                        <details className="bg-white p-6 rounded-lg group shadow-lg border border-slate-200/50 shadow-slate-200/50">
                            <summary className="font-semibold text-lg text-slate-800 list-none flex justify-between items-center cursor-pointer">
                                Is this YouTube Shorts Downloader completely free?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="transition-transform duration-300 group-open:rotate-180" width="16" height="16" fill="currentColor">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </summary>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                Yes, the core download functionality (up to 1080P HD) is <strong>100% free </strong>. We offer a paid subscription for premium features like 4K downloads and our AI Watermark Remover tool.
                            </p>
                        </details>
                        <details className="bg-white p-6 rounded-lg group shadow-lg border border-slate-200/50 shadow-slate-200/50">
                            <summary className="font-semibold text-lg text-slate-800 list-none flex justify-between items-center cursor-pointer">
                                Will the YouTube watermark be preserved when I download?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="transition-transform duration-300 group-open:rotate-180" width="16" height="16" fill="currentColor">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </summary>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                The free download retains the watermark. We offer a premium, paid AI feature specifically designed to remove watermarks for seamless cross-platform sharing.{" "}
                                <Link href="/no-watermark" className="text-red-500 font-semibold hover:underline">
                                    Learn more here.
                                </Link>
                            </p>
                        </details>
                        <details className="bg-white p-6 rounded-lg group shadow-lg border border-slate-200/50 shadow-slate-200/50">
                            <summary className="font-semibold text-lg text-slate-800 list-none flex justify-between items-center cursor-pointer">
                                Is this tool safe to use?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="transition-transform duration-300 group-open:rotate-180" width="16" height="16" fill="currentColor">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                </svg>
                            </summary>
                            <p className="mt-4 text-slate-600 leading-relaxed">Absolutely. We use secure, server-side processing methods. Your privacy is fully guaranteed, and we do not store your files or personal data.</p>
                        </details>
                    </div>
                </div>
            </section>
        </>
    )
}