"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 引入获取当前路径的钩子
import { useAuth } from '@/lib/auth-context';
import { ChevronDown } from 'lucide-react'; // 建议引入一个图标库增强视觉
import Image from 'next/image';

const NAV_CONFIG = [
    { label: 'Download Shorts', href: '/' },
    { label: 'MP3 Audio', href: '/shorts-to-mp3' },
    {
        label: 'AI Tools',
        type: 'dropdown',
        links: [
            { label: 'Watermark Remover', href: '/no-watermark' },
            { label: '4K Shorts Downloader', href: '/4k-shorts-downloader' },
            { label: 'Shorts Thumbnail Tool', href: '/shorts-thumbnail-tool' },
        ]
    },
    {
        label: 'Guide',
        type: 'dropdown',
        links: [
            { label: 'Chrome Extension', href: '/guide/chrome-extension' },
            { label: 'iPhone Downloader', href: '/guide/iphone-downloader' },
            { label: 'Latest Shorts Tool', href: '/guide/latest-shorts-tool' },
            { label: 'Shorts To MP3 Tutorial', href: '/guide/shorts-to-mp3-tutorial' },
            { label: 'Shorts Without Watermark', href: '/guide/shorts-without-watermark' },
            { label: 'Best Shorts Downloader Apps', href: '/shorts-reuse-guide' },
            { label: 'Shorts Creators Reddit Insights', href: '/shorts-creators-reddit-insights' }
        ]
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Add-On', href: '/addon' },
];

const Header = () => {
    const pathname = usePathname(); // 获取当前页面路径
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<string[]>([]); // 移动端折叠菜单状态
    const { user, isLoggedIn, credits, isLoaded, login, logout } = useAuth();

    // 切换移动端下拉菜单
    const toggleMobileDropdown = (label: string) => {
        setOpenDropdowns(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        );
    };

    // 辅助函数：判断链接是否激活
    const isActive = (href: string) => pathname === href;
    // 辅助函数：判断下拉菜单子项是否有激活的
    const isChildActive = (links: any[]) => links.some(link => pathname === link.href);

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isDrawerOpen]);

    const UserProfileUI = () => (
        <div className="flex items-center gap-3 bg-white p-1 pr-3 rounded-full border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full border border-slate-100 bg-red-600 text-white flex justify-center items-center font-bold">
                {user?.name?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-none">{user?.givenName || user?.name}</span>
                <button onClick={logout} className="text-[10px] text-left text-slate-400 hover:text-red-600 transition-colors underline mt-1">Logout</button>
            </div>
        </div>
    );

    const CreditBadge = () => (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full">
            <div className={`w-2 h-2 rounded-full ${credits > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className="text-xs font-bold text-slate-600">
                {isLoaded ? `${credits} Credits` : "---"}
            </span>
        </div>
    );

    return (
        <>
            <header className="py-4 px-6 md:px-12 sticky top-0 bg-white/70 backdrop-blur-md z-50 border-b border-slate-200/50 transition-all duration-300">
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <Link href="/" className="group flex items-center gap-2">
                        <Image src="/ytshortsdl-logo.webp" alt="logo" className="w-10 h-10 transition-transform group-hover:scale-110" width={40} height={40} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">YTShorts<span className="text-red-600">dl</span></span>
                    </Link>

                    {/* PC端导航 */}
                    <div className="hidden md:flex items-center space-x-7">
                        {NAV_CONFIG.map((item, idx) => (
                            item.type === 'dropdown' ? (
                                <div key={idx} className="relative group py-2">
                                    <button className={`font-medium transition-colors flex items-center gap-1.5 ${isChildActive(item.links!) ? 'text-red-600' : 'text-slate-600 hover:text-red-600'}`}>
                                        {item.label}
                                        <svg className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                                        {item.links?.map((sub, sIdx) => (
                                            <Link key={sIdx} href={sub.href} className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(sub.href) ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-red-600'}`}>
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link key={idx} href={item.href || '#'} className={`font-medium transition-colors ${isActive(item.href!) ? 'text-red-600 font-bold' : 'text-slate-600  '})}`}>
                                    {item.label}
                                </Link>
                            )
                        ))}
                        {/* <CreditBadge /> */}
                        {isLoggedIn ? <UserProfileUI /> : <button onClick={login} className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold hover:bg-red-600 transition-all shadow-md active:scale-95">Sign In</button>}
                    </div>

                    <button onClick={() => setIsDrawerOpen(true)} className="md:hidden flex items-center gap-3">
                        {/* <CreditBadge /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 text-slate-600" fill="currentColor"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" /></svg>
                    </button>
                </nav>
            </header>

            {/* 移动端抽屉 */}
            <div className={`fixed inset-0 bg-black/40 transition-opacity z-[60] md:hidden ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)}></div>
            <aside className={`fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-2xl transition-transform duration-300 z-[70] md:hidden overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">Menu</span>
                    <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-red-600 p-2 text-2xl">✕</button>
                </div>

                <nav className="p-6 space-y-2">
                    {/* 登录状态 */}
                    <div className="mb-8 pb-6 border-b border-slate-100">
                        {isLoggedIn ? (
                            <UserProfileUI />
                        ) : (
                            <button onClick={() => { login(); setIsDrawerOpen(false); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all">Sign in with Google</button>
                        )}
                    </div>

                    {/* 导航列表 */}
                    {NAV_CONFIG.map((item, idx) => (
                        <div key={idx} className="block">
                            {item.type === 'dropdown' ? (
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleMobileDropdown(item.label)}
                                        className={`w-full flex items-center justify-between py-3 px-4 rounded-xl font-bold transition-all ${isChildActive(item.links!) ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}
                                    >
                                        {item.label}
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdowns.includes(item.label) ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* 下拉子项 */}
                                    <div className={`overflow-hidden transition-all duration-300 space-y-1 ${openDropdowns.includes(item.label) ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                        {item.links?.map((sub, sIdx) => (
                                            <Link
                                                key={sIdx}
                                                href={sub.href}
                                                onClick={() => setIsDrawerOpen(false)}
                                                className={`block py-3 px-8 rounded-xl text-sm transition-all ${isActive(sub.href) ? 'text-red-600 font-bold bg-red-50/50' : 'text-slate-500'}`}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href!}
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={`block py-3 px-4 rounded-xl font-bold transition-all ${isActive(item.href!) ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Header;