"use client";

import { usePathname, useRouter } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import { PLAN_LIMITS } from '@/lib/limits';
import {
    ArrowRight,
    BrainCircuit,
    ChevronDown,
    Download,
    Eraser,
    FileText,
    Gem,
    Image as ImageIcon,
    Loader2,
    LogOut,
    Menu,
    MonitorPlay,
    Music,
    NotebookText,
    Sparkles,
    TrendingUp,
    X
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

// --- Types & Config ---

type NavItemConfig = {
    labelKey: string;
    href?: string;
    type?: 'link' | 'dropdown';
    descriptionKey?: string;
    icon?: React.ReactNode;
    items?: NavItemConfig[]; // For dropdowns
};

const getNavConfig = () => [
    {
        labelKey: 'creationAndAI',
        type: 'dropdown',
        items: [
            { labelKey: 'aiScriptGenerator', href: '/ai-script-generator', icon: <Sparkles size={18} className="text-purple-600" />, descriptionKey: 'generateEngagingScripts' },
            { labelKey: 'scriptConverter', href: '/video-to-script-converter', icon: <FileText size={18} className="text-blue-600" />, descriptionKey: 'videoToTextScripts' },
        ]
    },
    {
        labelKey: 'downloader',
        type: 'dropdown',
        items: [
            { labelKey: 'downloadShorts', href: '/', icon: <Download size={18} className="text-red-600" />, descriptionKey: 'saveShortsInHD' },
            { labelKey: 'mp3Audio', href: '/shorts-to-mp3', icon: <Music size={18} className="text-pink-600" />, descriptionKey: 'extractAudio' },
            { labelKey: '4kShortsDownloader', href: '/4k-shorts-downloader', icon: <MonitorPlay size={18} className="text-orange-600" />, descriptionKey: 'highQualityVideo' },
        ]
    },
    {
        labelKey: 'utility',
        type: 'dropdown',
        items: [
            { labelKey: 'watermarkRemover', href: '/no-watermark', icon: <Eraser size={18} className="text-teal-600" />, descriptionKey: 'cleanVideos' },
            { labelKey: 'shortsThumbnail', href: '/shorts-thumbnail-tool', icon: <ImageIcon size={18} className="text-indigo-600" />, descriptionKey: 'grabThumbnails' },
            { labelKey: 'youtubeTrend', href: '/trending', icon: <TrendingUp size={18} className="text-green-600" />, descriptionKey: 'viralContent' },
        ]
    },
    {
        labelKey: 'guide',
        type: 'dropdown',
        items: [
            { labelKey: 'chromeExtension', href: '/guide/chrome-extension', icon: <NotebookText size={18} className="text-red-600" />, descriptionKey: 'downloadExtensionGuide' },
            { labelKey: 'iphoneDownloader', href: '/guide/iphone-downloader', icon: <NotebookText size={18} className="text-red-600" />, descriptionKey: 'youtubeShortsDownloaderOnIphone' },
            { labelKey: 'latestShortsTool', href: '/guide/latest-shorts-tool', icon: <NotebookText size={18} className="text-red-600" />, descriptionKey: 'latestShortsToolGuide' },
            { labelKey: 'shortsToMp3Tutorial', href: '/guide/shorts-to-mp3-tutorial', icon: <NotebookText size={18} className="text-red-600 " />, descriptionKey: 'highQualityShortsMp3DownloaderGuide' },
            { labelKey: 'shortsWithoutWatermark', href: '/guide/shorts-without-watermark', icon: <NotebookText size={18} className="text-red-600" />, descriptionKey: 'downloadShortsWithoutWatermarks' },
            { labelKey: 'bestShortsDownloaderApps', href: '/shorts-reuse-guide', icon: <NotebookText size={18} className="text-red-600" />, descriptionKey: 'bestCreatorsEssentialGuide' },
            { labelKey: 'shortsCreatorsRedditInsights', href: '/shorts-creators-reddit-insights', icon: <NotebookText size={18} className="text-red-600" />, descriptionKey: 'ytShortsDownloaderReddit' }
        ],
    },
    { labelKey: 'pricing', href: '/pricing', type: 'link' },
];

// --- Sub Components ---

const CreditsBadge = ({ usage, isLoggedIn, login }: any) => {
    const [showCreditsBubble, setShowCreditsBubble] = useState(false);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const tHeader = useTranslations('header'); // 内部直接获取
    const tCommon = useTranslations('common'); // 内部直接获取
    const t = tHeader; // 保持兼容性

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
                setShowCreditsBubble(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const quotaInfo = useMemo(() => {
        const plan = (usage?.plan || 'FREE') as keyof typeof PLAN_LIMITS;
        const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;

        const getRemaining = (limit: number, used: number) => {
            if (limit > 9000) return '∞';
            return Math.max(0, limit - used);
        };

        const details = [
            {
                key: 'download',
                label: t('downloadShortsAndVideo'),
                icon: <Download size={14} className="text-blue-500" />,
                value: getRemaining(limits.download + ((usage as any)?.bonusDownloadQuota || 0), usage?.downloadCount || 0),
                isUnlimited: limits.download > 9000
            },
            {
                key: 'extract',
                label: t('extractTranscript'),
                icon: <FileText size={14} className="text-purple-500" />,
                value: getRemaining(limits.extract, usage?.extractionCount || 0), isUnlimited: limits.extract > 9000
            },
            {
                key: 'summary',
                label: t('aiSummaries'),
                icon: <BrainCircuit size={14} className="text-pink-500" />,
                value: getRemaining(limits.summary, usage?.summaryCount || 0),
                isUnlimited: limits.summary > 9000
            },
        ];
        const isTotalUnlimited = details.some(d => d.isUnlimited);
        const totalRemaining = isTotalUnlimited
            ? t('unlimitedAccess')
            : details.reduce((sum, item) => sum + (item.value as number), 0); return { details, plan, totalRemaining };
    }, [usage]);

    const handleNavigation = (href: string) => {
        setShowCreditsBubble(false);
        router.push(href);
    };

    return (
        <div className="relative z-[60]" ref={bubbleRef}>
            <button
                onClick={() => setShowCreditsBubble(!showCreditsBubble)}
                onMouseEnter={() => setShowCreditsBubble(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/50 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
            >
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500/20" />
                <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                    {quotaInfo.totalRemaining + ' ' + t('left')}
                </span>
            </button>

            <div className={`absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 p-0 transition-all duration-200 transform origin-top-right overflow-hidden ${showCreditsBubble ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('dailyQuotaStatus')}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${quotaInfo.plan !== 'FREE' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <Sparkles size={10} fill="currentColor" /> {quotaInfo.plan}
                    </div>
                </div>

                <div className="p-2 bg-white">
                    {quotaInfo.details.map((item) => (
                        <div key={item.key} className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">{item.icon}</div>
                                <span className="text-xs font-bold text-slate-600">{item.label}</span>
                            </div>
                            <span className={`text-sm font-black ${item.isUnlimited ? 'text-xl leading-none text-purple-600' : 'text-slate-900 concrete-value'}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
                    {quotaInfo.plan === 'FREE' ? (
                        <button
                            onClick={() => handleNavigation('/pricing')}
                            className="group/btn relative overflow-hidden flex items-center justify-between w-full p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md active:scale-95 text-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                            <div className="flex items-center gap-3 text-left relative z-10">
                                <div className="p-1.5 bg-white/20 rounded-lg"><Gem size={18} /></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold leading-none mb-0.5">{tCommon('upgradeToPro')}</span>
                                    <span className="text-[10px] opacity-80 font-medium">{tCommon('removeLimitsAndAds')}</span>
                                </div>
                            </div>
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-white/80" />
                        </button>
                    ) : (
                        <button onClick={() => handleNavigation('/pricing')} className="w-full text-center text-[10px] text-slate-400 hover:text-slate-900 font-bold py-1">{tCommon('manageSubscription')}</button>
                    )}
                </div>
            </div>
        </div>
    );
};
const languageSwitcherOptions = [{
    code: 'en',
    label: 'English',
    icon: <Image src="/flags/en.svg" width={24} height={20} alt="English" />
}, {
    code: 'hi',
    label: 'हिंदी',
    icon: <Image src="/flags/hi.svg" width={24} height={20} alt="हिंदी" />
}, {
    code: 'es',
    label: 'Español',
    icon: <Image src="/flags/es.svg" width={24} height={20} alt="Español" />
}]
const LanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const switchLanguage = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setShowMenu(false);
    };


    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
            >
                <>
                    {languageSwitcherOptions.find(opt => opt.code === locale)?.icon || <Image src={"/flags/" + locale + ".svg"} width={24} height={20} className="mr-2" alt={locale} />}
                    <span className="text-sm font-bold">{languageSwitcherOptions.find(opt => opt.code === locale)?.label || locale}</span>
                </>

                <ChevronDown size={14} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>
            {showMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 min-w-[120px]">
                    <button
                        onClick={() => switchLanguage('en')}
                        className={`w-full flex text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${locale === 'en' ? 'bg-slate-50 text-red-600' : 'text-slate-600'}`}
                    >
                        <Image src="/flags/en.svg" width={24} height={20} className="mr-2" alt='English' />
                        English
                    </button>
                    <button
                        onClick={() => switchLanguage('hi')}
                        className={`w-full flex text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${locale === 'hi' ? 'bg-slate-50 text-red-600' : 'text-slate-600'}`}
                    >
                        <Image src="/flags/hi.svg" width={28} height={20} className="mr-2" alt='हिंदी' />
                        हिंदी
                    </button>

                    <button
                        onClick={() => switchLanguage('es')}
                        className={`w-full flex text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${locale === 'es' ? 'bg-slate-50 text-red-600' : 'text-slate-600'}`}
                    >
                        <Image src="/flags/es.svg" width={28} height={20} className="mr-2" alt='Español' />
                        Español
                    </button>
                </div>
            )}
        </div>
    );
};

const Header = () => {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const { user, isLoggedIn, login, logout, isLoggingIn, usage } = useAuth();
    const tHeader = useTranslations('header');
    const tCommon = useTranslations('common');
    const NAV_CONFIG = getNavConfig();

    // Auth Dropdown State
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isDrawerOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isDrawerOpen]);

    // Click outside handler for profile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (href: string) => pathname === href;

    const UserProfileUI = () => (
        <div className="relative" ref={profileMenuRef}>
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
                <span className="text-xs font-bold text-slate-700 hidden sm:block max-w-[100px] truncate">
                    {user?.givenName || user?.name || "User"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white flex justify-center items-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:ring-slate-100 transition-all">
                    {user?.picture ? (
                        <img src={user.picture} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user?.name?.slice(0, 1).toUpperCase() || 'U'
                    )}
                </div>
            </button>

            {/* Profile Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 ring-1 ring-black/5 overflow-hidden transition-all duration-200 origin-top-right z-50 ${showProfileMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                    <Link href="/pricing" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                        <Gem size={16} className="text-purple-500" />
                        <span>{tCommon('subscription')}</span>
                    </Link>
                    <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                    <button
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                        <LogOut size={16} />
                        <span>{tCommon('signOut')}</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <header
                className={`transition-all duration-300 border-b ${isScrolled
                    ? 'bg-white/95 border-slate-200/60 shadow-sm py-2'
                    : 'bg-white border-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group relative z-50 mr-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Image src="/ytshortsdl-logo.webp" alt="logo" className="w-9 h-9 relative z-10 transition-transform duration-300 group-hover:scale-110" width={36} height={36} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-black transition-colors">
                            YTShorts<span className="text-red-500">dl</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mr-auto">
                        {NAV_CONFIG.map((item, idx) => (
                            <div key={idx} className="relative group/nav">
                                {item.type === 'dropdown' ? (
                                    <>
                                        <button className="flex items-center gap-1.5 px-3 py-2 font-bold text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
                                            {tHeader(item.labelKey)}
                                            <ChevronDown size={14} className="opacity-40 group-hover/nav:opacity-100 group-hover/nav:rotate-180 transition-all duration-200" />
                                        </button>

                                        {/* Dropdown Menu - Fixed Background & Visibility */}
                                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200 z-[100] min-w-[320px]">
                                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 ring-1 ring-black/5 overflow-hidden p-2">
                                                <div className="flex flex-col gap-1">
                                                    {item.items?.map((subItem, sIdx) => (
                                                        <Link
                                                            key={sIdx}
                                                            href={subItem.href || '#'}
                                                            className="group/item flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                                        >
                                                            <div className="mt-0.5 p-1.5 bg-slate-100 rounded-md group-hover/item:bg-white group-hover/item:shadow-sm border border-transparent group-hover/item:border-slate-100 transition-all text-slate-500 group-hover/item:text-slate-700">
                                                                {subItem.icon}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800 group-hover/item:text-red-600 transition-colors flex items-center gap-1">
                                                                    {tHeader(subItem.labelKey)}
                                                                </div>
                                                                {subItem.descriptionKey && (
                                                                    <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">{tHeader(subItem.descriptionKey)}</p>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        className={`block px-3 py-2 font-bold text-sm rounded-lg transition-all ${isActive(item.href!) ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                                    >
                                        {tHeader(item.labelKey)}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-slate-100">
                        <LanguageSwitcher />
                        <CreditsBadge usage={usage} isLoggedIn={isLoggedIn} login={login} />

                        {isLoggedIn ? <UserProfileUI /> : (
                            <div className="flex items-center gap-2">
                                <button onClick={login} className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">
                                    {tCommon('login')}
                                </button>
                                <button
                                    onClick={login}
                                    disabled={isLoggingIn}
                                    className="relative bg-slate-900 hover:bg-red-600 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 group"
                                >
                                    {isLoggingIn ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>{tCommon('wait')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{tCommon('getStarted')}</span>
                                            <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex lg:hidden items-center gap-3">
                        <CreditsBadge usage={usage} isLoggedIn={isLoggedIn} login={login} />
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="p-2 -mr-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsDrawerOpen(false)} />

            <aside className={`fixed inset-y-0 right-0 w-[85%] max-w-[320px] bg-white z-[70] lg:hidden shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
                    <span className="text-lg font-black text-slate-900">Menu</span>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Mobile Auth */}
                    {isLoggedIn ? (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white flex justify-center items-center font-bold text-lg shadow-sm">
                                    {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 line-clamp-1">{user?.name}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1">{user?.email}</span>
                                </div>
                            </div>
                            <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors">
                                <LogOut size={16} />
                                {tCommon('signOut')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={login} className="px-4 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">{tCommon('login')}</button>
                            <button onClick={login} className="px-4 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-colors">{tCommon('getStarted')}</button>
                        </div>
                    )}

                    {/* Mobile Navigation */}
                    <nav className="space-y-1">
                        {NAV_CONFIG.map((item, idx) => (
                            <div key={idx} className="border-b border-slate-50 last:border-none">
                                {item.type === 'dropdown' ? (
                                    <div className="py-2">
                                        <button
                                            onClick={() => setMobileExpanded(mobileExpanded === item.labelKey ? null : item.labelKey)}
                                            className="w-full flex items-center justify-between py-2 text-left font-bold text-slate-800"
                                        >
                                            {tHeader(item.labelKey)}
                                            <ChevronDown size={16} className={`transition-transform duration-300 ${mobileExpanded === item.labelKey ? 'rotate-180' : ''}`} />
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileExpanded === item.labelKey ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="py-2 pl-2 space-y-1">
                                                {item.items?.map((sub, sIdx) => (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.href || '#'}
                                                        onClick={() => setIsDrawerOpen(false)}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl active:bg-slate-50"
                                                    >
                                                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">{sub.icon}</div>
                                                        <span className="text-sm font-bold text-slate-700">{tHeader(sub.labelKey)}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="block py-3 font-bold text-slate-800 hover:text-red-600 transition-colors"
                                    >
                                        {tHeader(item.labelKey)}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Header;