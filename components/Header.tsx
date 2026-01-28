"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 引入 useRouter
import { useAuth } from '@/lib/auth-context';
import {
    ChevronDown, Loader2, Sparkles, Zap, Gem,
    Download, FileText, BrainCircuit
} from 'lucide-react';
import Image from 'next/image';

const NAV_CONFIG = [
    { label: 'Download Shorts', href: '/' },
    { label: 'MP3 Audio', href: '/shorts-to-mp3' },
    { label: 'Script Converter', href: '/video-to-script-converter' },
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

const CLIENT_PLAN_LIMITS = {
    FREE: { download: 1, extract: 1, summary: 1 },
    PRO: { download: 9999, extract: 150, summary: 300 },
    ELITE: { download: 9999, extract: 9999, summary: 9999 }
};

// --- 将 CreditsBadge 提取到外部，避免组件内嵌套定义导致的重绘问题 ---
const CreditsBadge = ({ usage, isLoggedIn, login }: any) => {
    const [showCreditsBubble, setShowCreditsBubble] = useState(false);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const router = useRouter(); // 使用 useRouter 进行更可靠的跳转

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
                setShowCreditsBubble(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const creditsInfo = useMemo(() => {
        const plan = (usage?.plan || 'FREE') as keyof typeof CLIENT_PLAN_LIMITS;
        const limits = CLIENT_PLAN_LIMITS[plan] || CLIENT_PLAN_LIMITS.FREE;

        const getRemaining = (limit: number, used: number) => {
            if (limit > 9000) return '∞';
            return Math.max(0, limit - used);
        };

        const details = [
            { key: 'download', label: 'Shorts Downloads', icon: <Download size={14} className="text-blue-500" />, value: getRemaining(limits.download, usage?.downloadCount || 0), isUnlimited: limits.download > 9000 },
            { key: 'extract', label: 'Audio & Script', icon: <FileText size={14} className="text-purple-500" />, value: getRemaining(limits.extract, usage?.extractionCount || 0), isUnlimited: limits.extract > 9000 },
            { key: 'summary', label: 'AI Summaries', icon: <BrainCircuit size={14} className="text-pink-500" />, value: getRemaining(limits.summary, usage?.summaryCount || 0), isUnlimited: limits.summary > 9000 },
        ];

        let totalDisplay: string | number = 0;
        if (plan === 'ELITE') totalDisplay = 'Elite';
        else if (plan === 'PRO') totalDisplay = 'Pro';
        else totalDisplay = (typeof details[0].value === 'number' ? details[0].value : 0) + (typeof details[1].value === 'number' ? details[1].value : 0) + (typeof details[2].value === 'number' ? details[2].value : 0);

        return { total: totalDisplay, details, plan };
    }, [usage]);

    // 统一的跳转处理函数
    const handleNavigation = (href: string) => {
        setShowCreditsBubble(false);
        router.push(href);
    };

    return (
        <div className="relative z-[60]" ref={bubbleRef}>
            <button
                onClick={() => setShowCreditsBubble(!showCreditsBubble)}
                onMouseEnter={() => setShowCreditsBubble(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full transition-all shadow-sm active:scale-95"
            >
                <Sparkles className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                <span className="text-sm font-black tracking-tight whitespace-nowrap">
                    {creditsInfo.total} {typeof creditsInfo.total === 'number' ? 'Left' : ''}
                </span>
            </button>

            <div className={`absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-0 transition-all duration-300 transform origin-top-right overflow-hidden ${showCreditsBubble ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="bg-slate-50/80 backdrop-blur-sm p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Quota Status</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${creditsInfo.plan !== 'FREE' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <Zap size={10} fill="currentColor" /> {creditsInfo.plan} Plan
                    </div>
                </div>

                <div className="p-2">
                    {creditsInfo.details.map((item) => (
                        <div key={item.key} className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-slate-100 rounded-lg">{item.icon}</div>
                                <span className="text-xs font-bold text-slate-600">{item.label}</span>
                            </div>
                            <span className={`text-sm font-black ${item.isUnlimited ? 'text-xl leading-none text-purple-600' : 'text-slate-900'}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
                    {!isLoggedIn && (
                        <button
                            onClick={() => { login(); setShowCreditsBubble(false); }}
                            className="group/login flex items-center justify-between w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-1.5 bg-white/20 rounded-lg"><Sparkles size={18} /></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold leading-none mb-0.5">Sign in for More</span>
                                    <span className="text-[10px] opacity-90 font-medium">Get +2 Bonus Credits</span>
                                </div>
                            </div>
                            <div className="bg-white/20 px-2 py-1 rounded text-[10px] font-black group-hover/login:bg-white/30 transition-colors">FREE</div>
                        </button>
                    )}

                    {creditsInfo.plan === 'FREE' && (
                        <button
                            onClick={() => handleNavigation('/pricing')}
                            className="group/btn flex items-center justify-between w-full p-3 bg-slate-900 hover:bg-red-600 text-white rounded-xl transition-all shadow-md active:scale-95 text-left"
                        >
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-1.5 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors"><Gem size={18} /></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold leading-none mb-0.5">Upgrade Plan</span>
                                    <span className="text-[10px] opacity-80 font-medium">Get Unlimited Access</span>
                                </div>
                            </div>
                            <span className="bg-white text-red-600 text-[10px] font-black px-2 py-1 rounded shadow-sm group-hover/btn:bg-yellow-300 group-hover/btn:text-slate-900 transition-colors">PRO</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Header = () => {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
    const { user, isLoggedIn, login, logout, isLoggingIn, usage } = useAuth();

    const toggleMobileDropdown = (label: string) => {
        setOpenDropdowns(prev => prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]);
    };

    const isActive = (href: string) => pathname === href;
    const isChildActive = (links: any[]) => links.some(link => pathname === link.href);

    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    }, [isDrawerOpen]);

    const UserProfileUI = () => (
        <div className="flex items-center gap-3 bg-white p-1 pr-3 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <div className="w-8 h-8 rounded-full border border-slate-100 bg-red-600 text-white flex justify-center items-center font-bold text-sm">
                {user?.name?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-none max-w-[80px] truncate">{user?.givenName || user?.name}</span>
                <button onClick={logout} className="text-[10px] text-left text-slate-400 hover:text-red-600 transition-colors font-medium mt-0.5">Sign out</button>
            </div>
        </div>
    );

    return (
        <>
            <header className="py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
                <nav className="flex justify-between items-center px-4 md:px-8 mx-auto">
                    <Link href="/" className="group flex items-center gap-2">
                        <Image src="/ytshortsdl-logo.webp" alt="logo" className="w-10 h-10 transition-transform group-hover:scale-110" width={40} height={40} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">YTShorts<span className="text-red-600">dl</span></span>
                    </Link>

                    <div className="hidden lg:flex items-center space-x-7">
                        {NAV_CONFIG.map((item, idx) => (
                            item.type === 'dropdown' ? (
                                <div key={idx} className="relative group py-2">
                                    <button className={`font-medium transition-colors flex items-center gap-1.5 ${isChildActive(item.links!) ? 'text-red-600' : 'text-slate-600 hover:text-red-600'}`}>
                                        {item.label}
                                        <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                                    </button>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-40">
                                        {item.links?.map((sub, sIdx) => (
                                            <Link key={sIdx} href={sub.href} className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(sub.href) ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-red-600'}`}>{sub.label}</Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link key={idx} href={item.href || '#'} className={`font-medium transition-colors ${isActive(item.href!) ? 'text-red-600 font-bold' : 'text-slate-600 hover:text-red-600'}`}>{item.label}</Link>
                            )
                        ))}

                        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

                        <div className="flex items-center gap-4">
                            <CreditsBadge usage={usage} isLoggedIn={isLoggedIn} login={login} />
                            {isLoggedIn ? <UserProfileUI /> : (
                                <button onClick={login} disabled={isLoggingIn} className={`min-w-[100px] flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold transition-all shadow-md active:scale-95 ${isLoggingIn ? 'bg-slate-400 text-white' : 'bg-slate-900 text-white hover:bg-red-600'}`}>
                                    {isLoggingIn ? "Wait..." : "Sign In"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex lg:hidden items-center gap-3">
                        <CreditsBadge usage={usage} isLoggedIn={isLoggedIn} login={login} />
                        <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                    </div>
                </nav>
            </header>

            {/* 移动端抽屉 (Drawer) 保持原有逻辑... */}
            <div className={`fixed inset-0 bg-black/40 transition-opacity z-[70] lg:hidden ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)}></div>
            <aside className={`fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-2xl transition-transform duration-300 z-[80] lg:hidden overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <span className="text-xl font-black text-slate-900">Menu</span>
                    <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 p-2 text-2xl">✕</button>
                </div>
                <nav className="p-6 space-y-2">
                    <div className="mb-8 pb-6 border-b border-slate-100">
                        {isLoggedIn ? <UserProfileUI /> : (
                            <button onClick={login} disabled={isLoggingIn} className="w-full py-4 rounded-2xl font-bold bg-slate-900 text-white">Sign In with Google</button>
                        )}
                    </div>
                    {NAV_CONFIG.map((item, idx) => (
                        <div key={idx} className="block">
                            {item.type === 'dropdown' ? (
                                <div className="space-y-1">
                                    <button onClick={() => toggleMobileDropdown(item.label)} className={`w-full flex items-center justify-between py-3 px-4 rounded-xl font-bold ${isChildActive(item.links!) ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}>
                                        {item.label}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.includes(item.label) ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDropdowns.includes(item.label) && (
                                        <div className="space-y-1 mt-1 pl-4">
                                            {item.links?.map((sub, sIdx) => (
                                                <Link key={sIdx} href={sub.href} onClick={() => setIsDrawerOpen(false)} className={`block py-3 px-4 rounded-xl text-sm ${isActive(sub.href) ? 'text-red-600 font-bold bg-red-50/50' : 'text-slate-500'}`}>{sub.label}</Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href={item.href!} onClick={() => setIsDrawerOpen(false)} className={`block py-3 px-4 rounded-xl font-bold ${isActive(item.href!) ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}>{item.label}</Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Header;