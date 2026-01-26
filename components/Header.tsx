"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ChevronDown, Loader2 } from 'lucide-react'; // 引入 Loader2
import Image from 'next/image';

const NAV_CONFIG = [
    { label: 'Download Shorts', href: '/' },
    { label: 'MP3 Audio', href: '/shorts-to-mp3' },
    { label: 'Video to Script Converter', href: '/video-to-script-converter' },
    { label: 'AI Script Generator', href: '/ai-script-generator' },
    { label: 'Youtube Trend', href: '/trending' },
    { label: 'Pricing', href: '/pricing' },
    {
        label: 'AI Tools',
        type: 'dropdown',
        links: [
            { label: 'Watermark Remover', href: '/no-watermark' },
            { label: '4K Shorts Downloader', href: '/4k-shorts-downloader' },
            { label: 'Shorts Thumbnail Tool', href: '/shorts-thumbnail-tool' },
        ]
    },
];

const Header = () => {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

    // 从 useAuth 中获取 isLoggingIn 状态
    const { user, isLoggedIn, credits, isLoaded, login, logout, isLoggingIn } = useAuth();

    const toggleMobileDropdown = (label: string) => {
        setOpenDropdowns(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        );
    };

    const isActive = (href: string) => pathname === href;
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

    return (
        <>
            <header className="py-4 px-6 md:px-12 sticky top-0 bg-white backdrop-blur-md z-50 border-b border-slate-200/50 transition-all duration-300">
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <Link href="/" className="group flex items-center gap-2">
                        <Image src="/ytshortsdl-logo.webp" alt="logo" className="w-10 h-10 transition-transform group-hover:scale-110" width={40} height={40} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">YTShorts<span className="text-red-600">dl</span></span>
                    </Link>

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
                                <Link key={idx} href={item.href || '#'} className={`font-medium transition-colors ${isActive(item.href!) ? 'text-red-600 font-bold' : 'text-slate-600 hover:text-red-600'}`}>
                                    {item.label}
                                </Link>
                            )
                        ))}

                        {isLoggedIn ? (
                            <UserProfileUI />
                        ) : (
                            <button
                                onClick={login}
                                disabled={isLoggingIn}
                                className={`min-w-[100px] flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold transition-all shadow-md active:scale-95 ${isLoggingIn ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-slate-900 text-white hover:bg-red-600'
                                    }`}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs">Signing in...</span>
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        )}
                    </div>

                    <button onClick={() => setIsDrawerOpen(true)} className="md:hidden flex items-center gap-3">
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
                    <div className="mb-8 pb-6 border-b border-slate-100">
                        {isLoggedIn ? (
                            <UserProfileUI />
                        ) : (
                            <button
                                onClick={() => { login(); }}
                                disabled={isLoggingIn}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${isLoggingIn ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white active:scale-95'
                                    }`}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Signing in with Google
                                    </>
                                )}
                            </button>
                        )}
                    </div>

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
                                    <div className={`overflow-hidden transition-all duration-300 space-y-1 ${openDropdowns.includes(item.label) ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                        {item.links?.map((sub, sIdx) => (
                                            <Link key={sIdx} href={sub.href} onClick={() => setIsDrawerOpen(false)} className={`block py-3 px-8 rounded-xl text-sm transition-all ${isActive(sub.href) ? 'text-red-600 font-bold bg-red-50/50' : 'text-slate-500'}`}>{sub.label}</Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link href={item.href!} onClick={() => setIsDrawerOpen(false)} className={`block py-3 px-4 rounded-xl font-bold transition-all ${isActive(item.href!) ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}`}>{item.label}</Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Header;