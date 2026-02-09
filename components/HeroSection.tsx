"use client";

import { useState, useEffect, useRef } from "react";
import {
    LoaderCircle, Layers, Link as LinkIcon, Download,
    FileArchive, FileText, Crown
} from 'lucide-react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import TranscriptDrawer from "@/components/TranscriptDrawer";
import SubscriptionModal from "@/components/SubscriptionModal";
import SurveyModal from "@/components/SurveyModal";
import { useToast } from "@/components/ToastContext";
import { trackEvent, GA_EVENTS } from "@/lib/gtag";
import { useTranslations } from 'next-intl';
import Image from "next/image";
const WORKER_URLS = [
    "https://dry-water-d2f3.franke-4b7.workers.dev",
    "https://throbbing-breeze-b608.franke-4b7.workers.dev",
    "https://broken-frost-aa82.franke-4b7.workers.dev",
    "https://fragrant-butterfly-8f1f.franke-4b7.workers.dev",
    "https://fancy-disk-b43e.franke-4b7.workers.dev",
    "https://cold-wood-3350.franke-4b7.workers.dev",
    "https://floral-queen-1592.franke-4b7.workers.dev",
    "https://quiet-lab-5ef6.franke-4b7.workers.dev",
    "https://fancy-sea-3f9a.franke-4b7.workers.dev"
];

// 1. 定义清晰度类型
type Quality = 'SD' | 'HD' | '4K';

// 优化后的骨架屏
const SkeletonCard = ({ isSingle }: { isSingle: boolean }) => (
    <div className={`bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm flex flex-col animate-pulse ${isSingle ? 'w-full max-w-md' : 'w-full'}`}>
        <div className="relative aspect-video bg-slate-200" />
        <div className="px-8 py-6 grow flex flex-col">
            <div className="h-4 bg-slate-100 rounded-full w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-6" />
            <div className="flex gap-2 mb-4"> {/* 清晰度按钮占位 */}
                <div className="h-8 w-12 bg-slate-50 rounded-lg" />
                <div className="h-8 w-12 bg-slate-50 rounded-lg" />
            </div>
            <div className="flex gap-2 mt-auto w-full">
                <div className="flex-[2] h-14 bg-slate-100 rounded-2xl" />
                <div className="flex-1 h-14 bg-slate-100 rounded-2xl" />
            </div>
        </div>
    </div>
);

export default function HeroSection() {
    const { consumeUsage, isLoggedIn, login, isLoggingIn, user } = useAuth();
    const t = useTranslations('hero');
    const tToast = useTranslations('toast');

    const [mode, setMode] = useState<"single" | "batch">("single");
    const [singleInputUrl, setSingleInputUrl] = useState("");
    const [batchInputUrl, setBatchInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [singleResults, setSingleResults] = useState<any[]>([]);
    const [batchResults, setBatchResults] = useState<any[]>([]);
    const [activeDownloads, setActiveDownloads] = useState<Record<number, number>>({});
    const [isZipDownloading, setIsZipDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState("");
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    // 记录每张卡片选择的清晰度，默认为 SD
    const [selectedQualities, setSelectedQualities] = useState<Record<number, Quality>>({});

    const [pendingAction, setPendingAction] = useState<{
        type: 'download' | 'transcript' | 'batch_zip',
        video?: any,
        index?: number,
        quality?: Quality
    } | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const API_SINGLE = 'https://ytdlp.vistaflyer.com/api/get-parse';
    const API_BATCH = 'https://ytdlp.vistaflyer.com/api/get-parse-batch';

    const currentResults = mode === "single" ? singleResults : batchResults;

    const handleSuccessfulDownloadTrigger = () => {
        const hasDoneSurvey = localStorage.getItem(`survey_done_${user?.id}`);
        if (isLoggedIn && !hasDoneSurvey) {
            setTimeout(() => {
                setIsSurveyOpen(true);
                trackEvent(GA_EVENTS.UI_SURVEY_VIEW);
            }, 2000);
        }
    };

    useEffect(() => {
        if (isLoggedIn && pendingAction) {
            if (pendingAction.type === 'download') {
                handleDownloadClick(pendingAction.video, pendingAction.index!, pendingAction.quality || 'SD');
            } else if (pendingAction.type === 'transcript') {
                handleOpenTranscript(pendingAction.video);
            } else if (pendingAction.type === 'batch_zip') {
                downloadBatchAsZip();
            }
            setPendingAction(null);
        }
    }, [isLoggedIn, pendingAction]);

    // 核心下载分流逻辑
    const handleDownloadClick = async (video: any, index: number, quality: Quality) => {
        // 如果点击的是高清选项，直接弹出订阅页
        if (quality !== 'SD') {
            trackEvent('premium_quality_click', { quality });
            setIsModalOpen(true);
            return;
        }

        // 以下是原有的 SD 下载逻辑
        if (!isLoggedIn) {
            trackEvent(GA_EVENTS.UI_LOGIN_PROMPT, { context: 'single_download' });
            setPendingAction({ type: 'download', video, index, quality });
            login();
            return;
        }

        if (activeDownloads[index] !== undefined || isZipDownloading) return;
        setActiveDownloads(prev => ({ ...prev, [index]: 0 }));

        const consumeSuccess = await consumeUsage('download');
        if (!consumeSuccess) {
            // 如果配额不足，移除 Loading 状态并弹出订阅窗
            setActiveDownloads(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });

            trackEvent(GA_EVENTS.F_PAYWALL_VIEW, { 'trigger': 'quota_insufficient' });

            setIsModalOpen(true);
            return;
        }

        setActiveDownloads(prev => ({ ...prev, [index]: 0 }));
        try {
            const blob = await downloadWithRetry(video, (p) => {
                setActiveDownloads(prev => ({ ...prev, [index]: p }));
            });
            saveAs(blob, `${video.title.replace(/[\\/:*?"<>|]/g, '_')}.mp4`);
            addToast(tToast('downloadedSuccessfully'), "success");
            handleSuccessfulDownloadTrigger();
        } catch (error: any) {
            // 出错时也要记得移除 Loading 状态
            setActiveDownloads(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });

            addToast(error.message, "error");
        } finally {
            setActiveDownloads(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });
        }
    };

    const downloadWithRetry = async (video: any, onProgress: (p: number) => void) => {
        for (let i = 0; i < WORKER_URLS.length; i++) {
            const currentWorker = WORKER_URLS[i];
            try {
                const downloadUrl = `${currentWorker}?title=${encodeURIComponent(video.title)}&url=${encodeURIComponent(video.url)}&ua=${encodeURIComponent(video.ua || '')}`;
                const response = await fetch(downloadUrl);
                if (response.status === 403) continue;
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const contentLength = response.headers.get('content-length');
                const total = contentLength ? parseInt(contentLength, 10) : 0;
                const reader = response.body?.getReader();
                if (!reader) throw new Error("Stream reader failed");
                const chunks = [];
                let loaded = 0;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    loaded += value.length;
                    if (total) onProgress(Math.round((loaded / total) * 100));
                }
                return new Blob(chunks, { type: 'video/mp4' });
            } catch (err) {
                if (i === WORKER_URLS.length - 1) throw err;
            }
        }
        throw new Error("Download nodes unavailable (403).");
    };

    const handleParse = async () => {
        const activeUrl = mode === "single" ? singleInputUrl : batchInputUrl;
        const urls = activeUrl.split('\n').filter(u => u.trim() !== "");
        if (urls.length === 0) { addToast(tToast('pleaseEnterAUrl'), "error"); return; }

        const countToShow = mode === "single" ? 1 : Math.min(urls.length, 3);
        setPendingCount(countToShow);
        setIsLoading(true);
        if (mode === "single") setSingleResults([]);
        else setBatchResults([]);

        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

        try {
            const token = localStorage.getItem('google_access_token');
            const headers = { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
            if (mode === "single" || urls.length === 1) {
                const res = await fetch(API_SINGLE, { method: 'POST', headers, body: JSON.stringify({ url: urls[0].trim() }) });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setSingleResults([{ ...data, targetUrl: urls[0].trim() }]);
            } else {
                const res = await fetch(API_BATCH, { method: 'POST', headers, body: JSON.stringify({ urls: urls.slice(0, 3) }) });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setBatchResults(data.results.map((v: any, i: number) => ({ ...v, targetUrl: urls[i].trim() })));
            }
            addToast(tToast('parsedSuccessfully'), "success");
        } catch (err: any) {
            addToast(tToast('pleaseTryAgain'), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadBatchAsZip = async () => {
        if (!isLoggedIn) {
            setPendingAction({ type: 'batch_zip' });
            login();
            return;
        }
        const validLinksCount = batchResults.filter(v => v.status !== 'failed').length;
        if (validLinksCount === 0) return;
        const consumeSuccess = await consumeUsage('download', validLinksCount);
        if (!consumeSuccess) {
            setIsModalOpen(true);
            return;
        }
        setIsZipDownloading(true);
        const zip = new JSZip();
        const folder = zip.folder("yt_shorts");
        try {
            for (let i = 0; i < batchResults.length; i++) {
                const video = batchResults[i];
                if (video.status === 'failed') continue;
                setDownloadProgress(`${i + 1}/${batchResults.length}`);
                try {
                    const blob = await downloadWithRetry(video, () => { });
                    folder?.file(`${video.title.replace(/[\\/:*?"<>|]/g, '_')}.mp4`, blob);
                } catch (e) { console.error(e); }
            }
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `batch_${Date.now()}.zip`);
            addToast(tToast('batchZipSuccess'), "success");
            handleSuccessfulDownloadTrigger();
        } catch (e: any) {
            addToast(tToast('zipFailed'), "error");
        } finally {
            setIsZipDownloading(false);
            setDownloadProgress("");
        }
    };

    const handleOpenTranscript = async (video: any) => {
        if (!isLoggedIn) {
            setPendingAction({ type: 'transcript', video });
            login();
            return;
        }
        setSelectedVideo(video);
        setIsDrawerOpen(true);
    };

    return (
        <>
            <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <SurveyModal isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />

            <section className="relative py-12 md:py-24 text-center px-4">
                <div className="glow-effect -z-10"></div>
                <div className="container max-w-6xl mx-auto relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter ">
                        {t('title')} <br /><span className="text-red-600">{t('aiCreatorSuite')}</span>
                    </h1>
                    <p className="mt-4 text-md md:text-lg text-slate-600 font-medium tracking-tight">
                        {t('subtitle')}
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 backdrop-blur-sm border border-white shadow-inner">
                            <button onClick={() => setMode("single")} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${mode === 'single' ? 'bg-white shadow-lg text-red-600' : 'text-slate-500 hover:text-slate-800'}`}><LinkIcon size={16} /> {t('single')}</button>
                            <button onClick={() => setMode("batch")} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${mode === 'batch' ? 'bg-white shadow-lg text-red-600' : 'text-slate-500 hover:text-slate-800'}`}><Layers size={16} /> {t('batch')}</button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                            <div className="flex flex-col md:flex-row items-stretch gap-3">
                                <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all px-4 items-center min-h-12 text-left">
                                    <div className="grow">
                                        {mode === 'single' ? (
                                            <div className="flex items-center h-12 px-2 text-left font-black">
                                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                                <input value={singleInputUrl} onChange={(e) => setSingleInputUrl(e.target.value)} placeholder={t('pasteYouTubeLinkHere')} className="w-full h-full bg-transparent outline-none text-slate-800 font-bold" />
                                            </div>
                                        ) : (
                                            <textarea ref={textareaRef} value={batchInputUrl} onChange={(e) => setBatchInputUrl(e.target.value)} rows={3} placeholder={t('pasteUpTo3Links')} className="w-full px-4 md:p-5 bg-transparent outline-none text-slate-800 font-mono text-sm leading-relaxed resize-none text-left overflow-hidden" />
                                        )}
                                        <button onClick={async () => {
                                            const text = await navigator.clipboard.readText();
                                            mode === 'single' ? setSingleInputUrl(text) : setBatchInputUrl(text);
                                        }} className="absolute hidden md:flex right-4 top-1/2 -translate-y-1/2 md:top-2 md:translate-y-0 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg transition-all shadow-sm z-10 items-center gap-1.5 ">{t('paste')}</button>
                                    </div>
                                </div>
                                <button onClick={handleParse} disabled={isLoading} className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95">
                                    {isLoading ? <LoaderCircle className="animate-spin" /> : <Download size={22} strokeWidth={3} />}
                                    <span>{isLoading ? t('wait') : t('parseVideo')}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Container */}
                    {(isLoading || currentResults.length > 0) && (
                        <div ref={resultsRef} className="mt-8 text-left animate-in fade-in slide-in-from-bottom-10 duration-700 scroll-mt-24">
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-slate-200 pb-8 gap-6">
                                <div className="w-full flex items-center gap-5">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white text-xl font-black shadow-lg">
                                        {isLoading ? pendingCount : currentResults.length}
                                    </span>
                                    <div>
                                        <div className="md:flex md:items-center gap-3 text-left">
                                            <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tighter  italic">
                                                {isLoading ? t('analyzingVideos') : t('readyToDownload')}
                                            </h3>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-2 font-bold  tracking-widest text-[10px]">
                                            {isLoading ? t('processingYourRequest') : t('parsedViaOurHighSpeedNode')}
                                        </p>
                                    </div>
                                </div>
                                {mode === "batch" && !isLoading && batchResults.length > 1 && (
                                    <button onClick={downloadBatchAsZip} disabled={isZipDownloading} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-2xl disabled:bg-slate-300">
                                        {isZipDownloading ? <LoaderCircle className="animate-spin" /> : <FileArchive size={18} />}
                                        <span>{isZipDownloading ? downloadProgress : t('downloadZip')}</span>
                                    </button>
                                )}
                            </div>

                            <div className={(isLoading ? pendingCount === 1 : currentResults.length === 1) ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
                                {isLoading ? (
                                    Array.from({ length: pendingCount }).map((_, idx) => <SkeletonCard key={idx} isSingle={pendingCount === 1} />)
                                ) : (
                                    currentResults.map((video, idx) => {
                                        const progress = activeDownloads[idx];
                                        const isItemLoading = progress !== undefined;
                                        const currentQual = selectedQualities[idx] || 'SD';

                                        return (
                                            <div key={idx} className={`group bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col ${currentResults.length === 1 ? 'w-full max-w-md' : 'w-full'}`}>
                                                <div className="relative aspect-video overflow-hidden">
                                                    <Image src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={video.title || "Untitled Video"} width="400"
                                                        height="225" unoptimized={true} />
                                                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg  tracking-tighter">{t('ready')}</div>
                                                </div>

                                                <div className="px-8 py-6 grow flex flex-col text-left">
                                                    <p className="text-sm font-bold text-slate-800 line-clamp-2 h-10 mb-4 leading-relaxed group-hover:text-red-600 transition-colors">{video.title || "Untitled Video"}</p>

                                                    {/* 清晰度选择器 */}
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {(['SD', 'HD', '2K', '4K'] as Quality[]).map((q) => (
                                                            <button
                                                                key={q}
                                                                onClick={() => setSelectedQualities(prev => ({ ...prev, [idx]: q }))}
                                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${currentQual === q
                                                                    ? 'bg-slate-900 border-slate-900 text-white'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-400'
                                                                    }`}
                                                            >
                                                                {q}
                                                                {q !== 'SD' && <Crown size={10} className={currentQual === q ? 'text-yellow-400' : 'text-slate-300'} />}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="flex gap-2 mt-auto w-full">
                                                        <button
                                                            onClick={() => handleDownloadClick(video, idx, currentQual)}
                                                            disabled={isItemLoading || isLoggingIn}
                                                            className={`flex-[2] py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg font-black ${
                                                                // 1. 如果是高级清晰度（无论登录与否），显示琥珀色
                                                                currentQual !== 'SD'
                                                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white'
                                                                    // 2. 如果没登录，显示蓝色或深色调，并提示需要登录
                                                                    : !isLoggedIn
                                                                        ? 'bg-slate-800 hover:bg-slate-900 text-white'
                                                                        // 3. 正常 SD 免费下载
                                                                        : (isItemLoading ? 'bg-slate-400 text-white shadow-none' : 'bg-slate-900 hover:bg-red-600 text-white')
                                                                }`}
                                                        >
                                                            {/* 图标逻辑 */}
                                                            {isItemLoading ? (
                                                                <LoaderCircle className="animate-spin" size={18} />
                                                            ) : isLoggingIn ? (
                                                                <LoaderCircle className="animate-spin" size={18} />
                                                            ) : currentQual !== 'SD' ? (
                                                                <Crown size={18} />
                                                            ) : !isLoggedIn ? (
                                                                <LinkIcon size={18} /> // 或者使用 LinkIcon/LockIcon 表示需要权限
                                                            ) : (
                                                                <Download size={18} />
                                                            )}

                                                            {/* 文案逻辑 */}
                                                            <span>
                                                                {isItemLoading ? `${progress}%` :
                                                                    isLoggingIn ? t('wait') :
                                                                        currentQual !== 'SD' ? `${t('unlock')} ${currentQual}` :
                                                                            !isLoggedIn ? t('loginToDownload') : t('freeDownload')}
                                                            </span>
                                                        </button>

                                                        {video.languages && video.languages.length > 0 && (
                                                            <button onClick={() => handleOpenTranscript(video)} className="flex-1 relative py-4 rounded-2xl flex items-center justify-center gap-1 transition-all border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black tracking-tighter">
                                                                <FileText size={14} />
                                                                {t('script')}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-12 flex flex-col items-center">
                    <span className="text-slate-400 mb-8  font-black tracking-[0.4em] text-[10px]">{t('professionalCreatorSuite')}</span>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/shorts-to-mp3"
                            onClick={() => {
                                trackEvent(GA_EVENTS.NAV_TOOL_CLICK, { 'tool_name': 'mp3' });
                            }}
                            className="px-10 py-4 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:shadow-2xl transition-all flex items-center gap-4 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🎵</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[10px] text-slate-400  mb-1 tracking-widest font-black text-[8px]">{t('tool01')}</p><p className="text-sm font-black">{t('extractMp3')}</p></div>
                        </Link>
                        <Link href="/video-to-script-converter"
                            onClick={() => {
                                trackEvent(GA_EVENTS.NAV_TOOL_CLICK, { 'tool_name': 'converter' });
                            }}
                            className="px-10 py-4 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:shadow-2xl transition-all flex items-center gap-4 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[10px] text-slate-400  mb-1 tracking-widest font-black text-[8px]">{t('tool02')}</p><p className="text-sm font-black">{t('videoToScript')}</p></div>
                        </Link>
                        <Link href="/ai-script-generator"
                            onClick={() => {
                                trackEvent(GA_EVENTS.NAV_TOOL_CLICK, { 'tool_name': 'generator' });
                            }}
                            className="px-10 py-4 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:shadow-2xl transition-all flex items-center gap-4 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">✍️</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[10px] text-slate-400  mb-1 tracking-widest font-black text-[8px]">{t('tool03')}</p><p className="text-sm font-black">{t('aiScriptGenerator')}</p></div>
                        </Link>
                    </div>
                </div>
            </section>

            <TranscriptDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} video={selectedVideo} />
        </>
    );
}