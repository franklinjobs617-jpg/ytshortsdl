import React from 'react';
import Link from 'next/link';

// 1. 提取链接配置数组
const FOOTER_LINKS = [
    {
        title: "Core Tools",
        links: [
            { label: "Download Shorts", href: "/" },
            { label: 'MP3 Audio', href: '/shorts-to-mp3' },
            { label: 'Video to Script Converter', href: '/video-to-script-converter' },
            { label: 'AI Script Generator', href: '/ai-script-generator' },
            { label: 'Youtube Trend', href: '/trending' },
        ],
    },
    {
        title: "Guide",

        links: [
            { label: 'Chrome Extension', href: '/guide/chrome-extension' },
            { label: 'iPhone Downloader', href: '/guide/iphone-downloader' },
            { label: 'Latest Shorts Tool', href: '/guide/latest-shorts-tool' },
            { label: 'Shorts To MP3 Tutorial', href: '/guide/shorts-to-mp3-tutorial' },
            { label: 'Shorts Without Watermark', href: '/guide/shorts-without-watermark' },
            { label: 'Best Shorts Downloader Apps', href: '/shorts-reuse-guide' },
            { label: 'Shorts Creators Reddit Insights', href: '/shorts-creators-reddit-insights' }
        ],
    },
    {
        title: "Tools",
        links: [
            { label: "Watermark Remover", href: "/no-watermark" },
            { label: "4K Shorts Downloader", href: "/4k-shorts-downloader" },
            { label: "Shorts Thumbnail Tool", href: "/shorts-thumbnail-tool" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Pricing", href: "/pricing" },
            { label: "Add-on", href: "/addon" },
            { label: "Shorts Reuse Guide", href: "/shorts-reuse-guide" },
            { label: "Support", href: "/support" },
            { label: "About Us", href: "/about" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-800 text-slate-300">
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-5 gap-8">

                    {/* Logo 区域 - 保持独立样式 */}
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-white">
                            YTShorts<span className="text-red-500">dl</span>.net
                        </Link>
                        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                            The ultimate tool for creators to download, optimize, and repurpose their YouTube Shorts
                            content. Fast, free, and built with passion.
                        </p>
                    </div>

                    {/* 循环渲染提取出的链接数组 */}
                    {FOOTER_LINKS.map((column, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-white mb-4">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-red-500 transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {/* 底部信息栏 */}
                <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-slate-500">
                        &copy; {currentYear} YTShortsdl.net. All rights reserved.
                    </p>

                    {/* 社交媒体图标 */}
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <SocialIcon type="twitter" />
                        <SocialIcon type="youtube" />
                        <SocialIcon type="github" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

// 提取社交图标为子组件，保持主逻辑清爽
const SocialIcon = ({ type }: { type: 'twitter' | 'youtube' | 'github' }) => {
    const icons = {
        twitter: "M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.5 24.8 1.5 49.5 0 94.9-16.8 131.2-44.8-46.2-.9-85.3-31.2-98.7-72.9 6.5 1.2 13 1.7 19.9 1.7 9.5 0 18.9-1.3 27.8-3.7-48.3-9.7-84.7-52.5-84.7-103 0-1.1 .5-2.2 .8-3.2 14.4 7.8 30.6 12.8 47.9 13.2-28.5-18.8-47.1-51.5-47.1-88 0-19.4 5.3-37.4 14.5-53.1 52.3 63.8 130.4 105.6 218.4 110-1.8-8.1-2.7-16.5-2.7-25 0-57.9 47.1-105 105.3-105 30.3 0 57.6 12.7 76.6 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.3-24.4 45.3-46.1 58.2 21.2-2.3 41.6-8.1 60.5-16.2-14.2 20.8-32.1 39.4-52.6 54.3z",
        youtube: "M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.9 48.3-48.6 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5l0-175.2l152.7 87.6l-152.7 87.6z",
        github: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-24.4 8.7-44.5 23-60.2-2.3-5.7-10-28.5 2.2-59.3 0 0 18.8-6.1 61.6 23.2 17.9-5.3 37.1-7.9 56.1-7.9 19 0 38.2 2.6 56.1 7.9 42.8-29.3 61.5-23.2 61.5-23.2 12.2 30.8 4.5 53.6 2.2 59.3 14.3 15.7 23 35.8 23 60.2 0 96.6-56.6 104.4-112.7 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 65.4-.3 74.2 0 6.6 4.4 14.4 17.4 12.1C426.3 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
    };

    return (
        <Link href="#" className="text-slate-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                <path d={icons[type]} />
            </svg>
        </Link>
    );
};

export default Footer;