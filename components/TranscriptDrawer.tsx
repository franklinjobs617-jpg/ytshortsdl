"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, X, Download, ClipboardPaste, Loader2, Languages, AlertCircle, RefreshCcw } from 'lucide-react';
import { saveAs } from "file-saver";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from "@/components/ToastContext";
import { trackEvent, GA_EVENTS } from '@/lib/gtag'; // 引入埋点

interface TranscriptDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    video: any;
}

const API_BASE = "https://ytdlp.vistaflyer.com";
const CACHE_KEY = "last_transcript_cache";

const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({ isOpen, onClose, video }) => {
    const { addToast } = useToast();
    const router = useRouter();
    const { checkQuota, consumeUsage } = useAuth();

    const [view, setView] = useState<"time" | "text">("time");
    const [selectedLang, setSelectedLang] = useState("");
    const [segments, setSegments] = useState<any[]>([]);
    const [fullText, setFullText] = useState("");

    const [loadingContent, setLoadingContent] = useState(false);
    const [isDownloadingSrt, setIsDownloadingSrt] = useState(false);
    const [isDownloadingTxt, setIsDownloadingTxt] = useState(false);

    const processingRef = useRef<string>("");

    // 获取字幕内容的核心函数
    const fetchContent = useCallback(async (langCode: string, targetUrl: string) => {
        const processKey = `${targetUrl}_${langCode}`;
        if (loadingContent || processingRef.current === processKey) return;

        processingRef.current = processKey;
        setLoadingContent(true);

        // 埋点：开始提取漏斗第一步
        trackEvent(GA_EVENTS.F_EXTRACT_START, { lang: langCode });

        try {
            // 1. 检查配额
            const canExtract = await checkQuota('extract');
            if (!canExtract) {
                // 埋点：支付拦截
                trackEvent(GA_EVENTS.F_PAYWALL_VIEW, { trigger: 'transcript_drawer' });
                addToast("Daily quota reached", "error");
                onClose();
                return;
            }

            // 2. 获取内容
            const res = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl, lang: langCode })
            });

            if (!res.ok) throw new Error("Transcript not found");
            const data = await res.json();

            // 3. 成功后执行扣费
            const consumeSuccess = await consumeUsage('extract');
            if (consumeSuccess) {
                const newSegments = data.segments || [];
                const newFullText = data.full_text || "";

                setSegments(newSegments);
                setFullText(newFullText);

                // 埋点：提取漏斗第二步成功
                trackEvent(GA_EVENTS.F_EXTRACT_SUCCESS, { lang: langCode });

                sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                    url: targetUrl,
                    lang: langCode,
                    segments: newSegments,
                    fullText: newFullText
                }));
                addToast("Transcript extracted", "success");
            }
        } catch (err: any) {
            // 埋点：提取失败监控
            trackEvent(GA_EVENTS.ERR_EXTRACT, { message: err.message, lang: langCode });
            setSegments([]);
            setFullText("");
            addToast("Failed to load transcript", "error");
        } finally {
            setLoadingContent(false);
            processingRef.current = "";
        }
    }, [checkQuota, consumeUsage, addToast, onClose, loadingContent]);

    useEffect(() => {
        if (!isOpen || !video?.targetUrl) return;

        const currentUrl = video.targetUrl;
        const cachedStr = sessionStorage.getItem(CACHE_KEY);

        if (cachedStr) {
            try {
                const cachedData = JSON.parse(cachedStr);
                if (cachedData.url === currentUrl) {
                    if (!selectedLang || selectedLang === cachedData.lang) {
                        setSegments(cachedData.segments);
                        setFullText(cachedData.fullText);
                        setSelectedLang(cachedData.lang);
                        return;
                    }
                }
            } catch (e) {
                sessionStorage.removeItem(CACHE_KEY);
            }
        }

        if (!selectedLang) {
            const hasEn = video.languages?.find((l: any) => l.code === 'en');
            const defaultCode = hasEn ? 'en' : (video.languages?.[0]?.code || "");
            setSelectedLang(defaultCode);
            return;
        }

        fetchContent(selectedLang, currentUrl);

    }, [isOpen, video?.targetUrl, selectedLang, fetchContent]);

    useEffect(() => {
        if (!isOpen) {
            setSegments([]);
            setFullText("");
            setSelectedLang("");
            processingRef.current = "";
        }
    }, [isOpen]);

    const handleRemixClick = () => {
        if (!video?.targetUrl) return;

        // 埋点：关键引流动作
        trackEvent(GA_EVENTS.NAV_AI_REMIX, { lang: selectedLang });

        sessionStorage.setItem('pending_remix_data', JSON.stringify({
            url: video.targetUrl, meta: video, segments, fullText, selectedLang
        }));
        onClose();
        router.push('/ai-script-generator');
    };

    const copyToClipboard = () => {
        const textToCopy = view === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText;
        navigator.clipboard.writeText(textToCopy);

        // 埋点：交互动作
        trackEvent(GA_EVENTS.UI_TRANS_ACTION, { type: 'copy' });

        addToast("Copied!", "success");
    };

    const handleDownload = async (type: 'srt' | 'txt') => {
        // 埋点：交互动作
        trackEvent(GA_EVENTS.UI_TRANS_ACTION, { type });

        if (type === 'srt') setIsDownloadingSrt(true); else setIsDownloadingTxt(true);
        try {
            const downloadUrl = `${API_BASE}/api/transcript/download?url=${encodeURIComponent(video.targetUrl)}&lang=${selectedLang}&type=${type}`;
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            saveAs(blob, `${(video?.title || 'transcript').replace(/[\\/:*?"<>|]/g, '_')}.${type}`);
            addToast("Downloaded", "success");
        } catch (err) {
            addToast("There are some issues, Try again !", "error");
        } finally {
            if (type === 'srt') setIsDownloadingSrt(false); else setIsDownloadingTxt(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-150 transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><FileText size={20} strokeWidth={3} /></div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Transcript</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">AI Context Extraction</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} strokeWidth={3} className="text-slate-400" /></button>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex gap-3 items-center border-b border-slate-100">
                    {video && <><img src={video.thumbnail} className="w-20 aspect-video object-cover rounded-lg shadow-sm" alt="" /><p className="text-xs font-bold text-slate-600 line-clamp-2 italic text-left">{video.title}</p></>}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-red-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">Repurpose Content</p>
                        <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">AI PRO</span>
                    </div>
                    <button onClick={handleRemixClick} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 text-sm">
                        <FileText size={18} strokeWidth={3} /> Rewrite with AI Remix
                    </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between gap-3 border-b border-slate-50">
                    <div className="relative flex-1">
                        <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                            value={selectedLang}
                            onChange={(e) => {
                                setSelectedLang(e.target.value);
                                // 埋点：语言切换
                                trackEvent(GA_EVENTS.UI_TRANS_LANG, { lang_code: e.target.value });
                            }}
                            disabled={loadingContent}
                            className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-black text-slate-700 outline-none appearance-none cursor-pointer disabled:opacity-50"
                        >
                            {video?.languages?.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(["time", "text"] as const).map((m) => (
                            <button key={m} onClick={() => {
                                setView(m);
                                // 埋点：视图切换
                                trackEvent(GA_EVENTS.UI_TRANS_VIEW, { mode: m });
                            }} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === m ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
                        ))}
                    </div>
                </div>

                <div className="grow overflow-y-auto p-6 scrollbar-thin">
                    {loadingContent ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Loading Data...</p>
                        </div>
                    ) : segments?.length > 0 ? (
                        <div className="animate-in fade-in duration-500">
                            {view === "time" ? (
                                <div className="space-y-6">
                                    {segments.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 group text-left">
                                            <span className="font-mono text-[10px] text-red-500/60 font-black shrink-0 mt-1">{item.t}</span>
                                            <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors">{item.txt}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="text-sm text-slate-700 font-medium leading-loose whitespace-pre-wrap text-left">{fullText}</div>}
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                // 埋点：重试
                                trackEvent(GA_EVENTS.UI_TRANS_RETRY);
                                fetchContent(selectedLang, video.targetUrl);
                            }}
                            className="h-full w-full flex flex-col items-center justify-center text-slate-300 hover:text-red-500 transition-colors group p-10"
                        >
                            <RefreshCcw size={40} className="mb-4 group-hover:rotate-180 transition-transform duration-500" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Transcript Found</p>
                            <span className="text-[10px] mt-2 underline opacity-70">Click to try again</span>
                        </button>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 grid grid-cols-4 gap-3 bg-white">
                    <button disabled={loadingContent || segments.length === 0} onClick={copyToClipboard} className="col-span-2 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl disabled:bg-slate-200">Copy</button>
                    <button disabled={loadingContent || segments.length === 0 || isDownloadingSrt} onClick={() => handleDownload('srt')} className="col-span-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-50">
                        {isDownloadingSrt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        <span className="text-[8px] mt-1 font-black uppercase text-center">SRT</span>
                    </button>
                    <button disabled={loadingContent || segments.length === 0 || isDownloadingTxt} onClick={() => handleDownload('txt')} className="col-span-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-50">
                        {isDownloadingTxt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        <span className="text-[8px] mt-1 font-black uppercase text-center">TXT</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TranscriptDrawer;