"use client";

import { useState, useEffect, useRef } from "react";
import {
    LoaderCircle, Link as LinkIcon, Download,
    FileText, AlertCircle, X, Sparkles, Languages,
    ClipboardPaste, Loader2
} from 'lucide-react';
import { saveAs } from "file-saver";
import Link from "next/link";

interface Language {
    code: string;
    label: string;
    is_auto: boolean;
}

interface Segment {
    t: string;
    txt: string;
}

interface TranscriptMeta {
    id: string;
    title: string;
    thumbnail: string;
    languages: Language[];
    default_lang: string;
}

const API_BASE = "https://ytdlp.vistaflyer.com";

export default function VideoToScriptToolSection() {
    // --- 状态管理 ---
    const [inputUrl, setInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 字幕相关状态
    const [view, setView] = useState<"time" | "text">("time");
    const [selectedLang, setSelectedLang] = useState("");
    const [meta, setMeta] = useState<TranscriptMeta | null>(null);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [fullText, setFullText] = useState("");

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const [isDownloadingSrt, setIsDownloadingSrt] = useState(false);
    const [isDownloadingTxt, setIsDownloadingTxt] = useState(false);

    const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
    const resultsRef = useRef<HTMLDivElement>(null);

    // --- 辅助功能 ---
    const addToast = (message: string, type: 'success' | 'error' = 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputUrl(text);
            addToast("URL pasted", "success");
        } catch (err) {
            addToast("Clipboard access denied.", "error");
        }
    };

    // --- 核心逻辑 ---

    // 1. 触发解析
    const handleParse = async () => {
        if (!inputUrl.trim()) {
            addToast("Please enter a valid URL.", "error");
            return;
        }

        setIsLoading(true);
        setError(null);
        setMeta(null);

        try {
            // 步骤 A: 获取字幕元数据和语言列表
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl.trim() })
            });

            if (!res.ok) throw new Error("Failed to get video transcript info");

            const data: TranscriptMeta = await res.json();
            setMeta(data);
            setSelectedLang(data.default_lang);

            // 步骤 B: 自动加载默认语言内容 (由 useEffect 监听 selectedLang 触发)
            addToast("Video parsed successfully", "success");
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        } catch (err: any) {
            setError(err.message || "Failed to parse video.");
            addToast(err.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. 监听语言变化加载内容
    useEffect(() => {
        if (selectedLang && inputUrl) {
            fetchContent(selectedLang);
        }
    }, [selectedLang]);

    const fetchContent = async (langCode: string) => {
        setLoadingContent(true);
        try {
            const res = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl.trim(), lang: langCode })
            });

            if (!res.ok) throw new Error("Failed to load transcript content");

            const data = await res.json();
            setSegments(data.segments);
            setFullText(data.full_text);
        } catch (err) {
            addToast("Failed to load transcript text", "error");
        } finally {
            setLoadingContent(false);
        }
    };

    // 3. 复制功能
    const copyToClipboard = () => {
        const textToCopy = view === "time"
            ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n')
            : fullText;

        navigator.clipboard.writeText(textToCopy);
        addToast("Copied to clipboard", "success");
    };

    // 4. 下载功能
    const handleDownload = async (type: 'srt' | 'txt') => {
        if (type === 'srt') setIsDownloadingSrt(true);
        else setIsDownloadingTxt(true);

        const downloadUrl = `${API_BASE}/api/transcript/download?url=${encodeURIComponent(inputUrl.trim())}&lang=${selectedLang}&type=${type}`;

        try {
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("File generation failed");

            const blob = await response.blob();
            const safeTitle = meta?.title ? meta.title.replace(/[\\/:*?"<>|]/g, '_') : 'transcript';
            saveAs(blob, `${safeTitle}.${type}`);
            addToast(`${type.toUpperCase()} downloaded`, "success");
        } catch (err) {
            addToast(`Download failed`, "error");
        } finally {
            if (type === 'srt') setIsDownloadingSrt(false);
            else setIsDownloadingTxt(false);
        }
    };

    const renderLoader = () => (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Processing Stream...</p>
        </div>
    );

    return (
        <section className="relative py-12 md:py-24 text-center px-4">
            <div className="glow-effect -z-10"></div>

            {/* --- Toast 区域 --- */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-100 flex flex-col items-center pointer-events-none w-xs md:w-lg px-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-slate-900' : 'bg-green-600'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto mb-3 border border-white/10 w-full`}>
                        <span className={toast.type === 'error' ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{toast.type === 'error' ? '●' : '✓'}</span>
                        <span className="font-bold text-xs">{toast.message}</span>
                    </div>
                ))}
            </div>

            <div className="container max-w-6xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                    Free YouTube Video to Script Converter: <br /><span className="text-red-600">Instant AI Transcripts</span>
                </h1>
                <p className="mt-4 text-md md:text-lg text-slate-600 font-medium tracking-tight">
                    Convert video to high-quality text scripts in seconds.
                </p>

                {/* 输入区样式同步首页 */}
                <div className="max-w-4xl mx-auto mt-10 mb-12">
                    <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                        <form onSubmit={(e) => { e.preventDefault(); handleParse(); }} className="flex flex-col md:flex-row items-stretch gap-3">
                            <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all px-4 items-center h-12">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="Paste YouTube link here..."
                                    className="w-full h-full bg-transparent outline-none text-slate-800 font-bold"
                                />
                                <button type="button" onClick={handlePaste} className="absolute hidden md:flex right-4 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg shadow-sm items-center gap-1.5 uppercase">Paste</button>
                            </div>
                            <button type="submit" disabled={isLoading} className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200">
                                {isLoading ? <LoaderCircle className="animate-spin" /> : <FileText size={22} strokeWidth={3} />}
                                <span>{isLoading ? 'Wait...' : 'Parse Video'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* 结果显示区域 - 字幕 UI */}
                {meta && (
                    <div ref={resultsRef} className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">

                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                    <FileText size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Transcript</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">AI Context Extraction</p>
                                </div>
                            </div>
                            <button onClick={() => setMeta(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} strokeWidth={3} className="text-slate-400" />
                            </button>
                        </div>

                        {/* 视频元数据展示 */}
                        <div className="px-6 py-4 bg-slate-50 flex gap-4 items-center border-b border-slate-100">
                            <img src={meta.thumbnail} className="w-24 aspect-video object-cover rounded-xl shadow-sm" alt="" />
                            <p className="text-sm font-bold text-slate-700 line-clamp-2 italic text-left">{meta.title}</p>
                        </div>

                        {/* 重写/AI 引导区 */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-red-50/30">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">Ready to Repurpose?</p>
                                <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">PRO</span>
                            </div>
                            <Link href="/ai-script-generator"
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 text-sm">
                                <Sparkles size={18} strokeWidth={3} />
                                Rewrite with AI Remix
                            </Link>
                        </div>

                        {/* 控制面板 */}
                        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50">
                            <div className="relative w-full sm:w-64">
                                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select
                                    disabled={loadingContent}
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                    className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-black text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
                                >
                                    {meta.languages.map(l => (
                                        <option key={l.code} value={l.code}>
                                            {l.label} {l.is_auto ? '(Auto)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                                {(["time", "text"] as const).map((modeOption) => (
                                    <button
                                        key={modeOption}
                                        onClick={() => setView(modeOption)}
                                        className={`flex-1 sm:flex-none px-6 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === modeOption ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {modeOption}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 字幕内容滚动区 */}
                        <div className="h-[500px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 bg-white">
                            {loadingContent ? (
                                renderLoader()
                            ) : segments.length > 0 ? (
                                <div className="animate-in fade-in duration-500 text-left">
                                    {view === "time" ? (
                                        <div className="space-y-6">
                                            {segments.map((item, i) => (
                                                <div key={i} className="flex gap-4 group">
                                                    <span className="font-mono text-[10px] text-red-500/60 font-black tabular-nums shrink-0 mt-1">{item.t}</span>
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors select-text">
                                                        {item.txt}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-700 font-medium leading-loose select-text whitespace-pre-wrap">
                                            {fullText}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center p-10">
                                    <AlertCircle size={40} strokeWidth={1} className="mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No Transcript Found</p>
                                </div>
                            )}
                        </div>

                        {/* 操作栏 */}
                        <div className="p-6 border-t border-slate-100 grid grid-cols-4 gap-3 bg-white">
                            <button
                                disabled={loadingContent || segments.length === 0}
                                onClick={copyToClipboard}
                                className="col-span-2 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:bg-slate-200 disabled:shadow-none uppercase text-[11px] tracking-widest"
                            >
                                <ClipboardPaste size={16} /> Copy
                            </button>

                            <button
                                disabled={loadingContent || segments.length === 0 || isDownloadingSrt}
                                onClick={() => handleDownload('srt')}
                                className={`col-span-1 py-4 font-black rounded-2xl flex flex-col items-center justify-center transition-all 
                                    ${isDownloadingSrt ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >
                                {isDownloadingSrt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                                <span className="text-[8px] mt-1 uppercase font-black">{isDownloadingSrt ? '...' : 'SRT'}</span>
                            </button>

                            <button
                                disabled={loadingContent || segments.length === 0 || isDownloadingTxt}
                                onClick={() => handleDownload('txt')}
                                className={`col-span-1 py-4 font-black rounded-2xl flex flex-col items-center justify-center transition-all 
                                    ${isDownloadingTxt ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >
                                {isDownloadingTxt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                                <span className="text-[8px] mt-1 uppercase font-black">{isDownloadingTxt ? '...' : 'TXT'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 工具导航区 */}
            <div className="pt-12 flex flex-col items-center max-w-6xl mx-auto">
                <span className="text-slate-400 mb-4 font-bold text-sm">Professional Creator Suite</span>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                        <span className="text-2xl">📽️</span>
                        <div className="text-left font-black tracking-tighter"><p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 01</p><p className="text-sm font-black">Download Shorts</p></div>
                    </Link>
                    <Link href="/shorts-to-mp3" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                        <span className="text-2xl">🎵</span>
                        <div className="text-left font-black tracking-tighter">
                            <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 02</p>
                            <p className="text-sm font-black">Extract MP3</p></div>
                    </Link>
                    <Link href="/ai-script-generator" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                        <span className="text-2xl">✍️</span>
                        <div className="text-left font-black tracking-tighter">
                            <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 03</p>
                            <p className="text-sm font-black">AI Script Generator</p></div>
                    </Link>
                </div>
            </div>
        </section>
    );
}