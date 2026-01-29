"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    LoaderCircle, Link as LinkIcon, Download,
    FileText, AlertCircle, X, Sparkles, Languages,
    ClipboardPaste, Loader2, RefreshCcw, Check
} from 'lucide-react';
import { saveAs } from "file-saver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import SubscriptionModal from "@/components/SubscriptionModal"; // 🚀 引入新组件
import { useToast } from "@/components/ToastContext";

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
    const { consumeUsage, checkQuota } = useAuth();
    const router = useRouter();

    // --- 状态管理 ---
    const [inputUrl, setInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 字幕相关状态
    const [view, setView] = useState<"time" | "text">("time");
    const [selectedLang, setSelectedLang] = useState("");
    const [meta, setMeta] = useState<TranscriptMeta | null>(null);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [fullText, setFullText] = useState("");

    const [loadingContent, setLoadingContent] = useState(false);
    const [isDownloadingSrt, setIsDownloadingSrt] = useState(false);
    const [isDownloadingTxt, setIsDownloadingTxt] = useState(false);

    const { addToast } = useToast();
    const resultsRef = useRef<HTMLDivElement>(null);



    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputUrl(text);
            addToast("URL pasted", "success");
        } catch (err) {
            addToast("Clipboard access denied.", "error");
        }
    };

    const fetchContentWithCheck = async (langCode: string, targetUrl: string) => {
        // 1. 服务器配额预检（不扣）
        const hasQuota = await checkQuota('extract');
        if (!hasQuota) {
            setIsModalOpen(true);
            return;
        }

        setLoadingContent(true);
        try {
            // 2. 调用真正的转写内容接口
            const res = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl.trim(), lang: langCode })
            });

            if (!res.ok) throw new Error("Failed to load transcript content");

            const data = await res.json();
            setSegments(data.segments || []);
            setFullText(data.full_text || "");

            // 3. API 成功返回后，再扣除一次 extract 配额
            await consumeUsage('extract');
        } catch (err: any) {
            addToast(err.message, "error");
            setSegments([]);
        } finally {
            setLoadingContent(false);
        }
    };

    const handleParse = async () => {
        if (!inputUrl.trim()) {
            addToast("Please enter a valid URL.", "error");
            return;
        }

        setIsLoading(true);
        setError(null);
        setMeta(null);

        try {
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl.trim() })
            });

            if (!res.ok) throw new Error("Failed to get video transcript info");

            const data: TranscriptMeta = await res.json();
            setMeta(data);
            const defaultLang = data.default_lang;
            setSelectedLang(defaultLang);

            await fetchContentWithCheck(defaultLang, inputUrl.trim());

            addToast("Video parsed successfully", "success");
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        } catch (err: any) {
            setError(err.message || "Failed to parse video.");
            addToast(err.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemixClick = () => {
        if (!inputUrl.trim()) return;
        const dataToPass = {
            url: inputUrl.trim(),
            meta: meta,
            segments: segments,
            fullText: fullText,
            selectedLang: selectedLang
        };
        sessionStorage.setItem('pending_remix_data', JSON.stringify(dataToPass));
        router.push('/ai-script-generator');
    };

    const handleLangChange = (newLang: string) => {
        setSelectedLang(newLang);
        fetchContentWithCheck(newLang, inputUrl);
    };

    const copyToClipboard = () => {
        const textToCopy = view === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText;
        navigator.clipboard.writeText(textToCopy);
        addToast("Copied!", "success");
    };

    const handleDownload = async (type: 'srt' | 'txt') => {
        if (type === 'srt') setIsDownloadingSrt(true);
        else setIsDownloadingTxt(true);

        try {
            const downloadUrl = `${API_BASE}/api/transcript/download?url=${encodeURIComponent(inputUrl.trim())}&lang=${selectedLang}&type=${type}`;
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("File generation failed");
            const blob = await response.blob();
            saveAs(blob, `${(meta?.title || 'transcript').replace(/[\\/:*?"<>|]/g, '_')}.${type}`);
            addToast(`${type.toUpperCase()} downloaded`, "success");
        } catch (err) {
            addToast(`Download failed`, "error");
        } finally {
            if (type === 'srt') setIsDownloadingSrt(false); else setIsDownloadingTxt(false);
        }
    };

    return (
        <section className="relative py-12 md:py-24 text-center px-4">

            {/* 🚀 正式的订阅弹窗组件 */}
            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="glow-effect -z-10"></div>



            <div className="container max-w-6xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                    Free YouTube Video to Script Converter: <br /><span className="text-red-600">Instant AI Transcripts</span>
                </h1>
                <p className="mt-4 text-md md:text-lg text-slate-600 font-medium tracking-tight">
                    Convert video to high-quality text scripts in seconds.
                </p>

                <div className="max-w-4xl mx-auto mt-10 mb-12">
                    <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                        <form onSubmit={(e) => { e.preventDefault(); handleParse(); }} className="flex flex-col md:flex-row items-stretch gap-3 text-left">
                            <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all px-4 items-center h-12">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="Paste YouTube link here..."
                                    className="w-full h-full bg-transparent outline-none text-slate-800 font-bold"
                                />
                                <button type="button" onClick={handlePaste} className="absolute hidden md:flex right-4 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg transition-all shadow-sm items-center gap-1.5 uppercase">Paste</button>
                            </div>
                            <button type="submit" disabled={isLoading} className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin" size={22} /> : <FileText size={22} strokeWidth={3} />}
                                <span>{isLoading ? 'Wait...' : 'Parse Video'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {meta && (
                    <div ref={resultsRef} className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                    <FileText size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Transcript</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">AI Context Extraction</p>
                                </div>
                            </div>
                            <button onClick={() => setMeta(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 flex gap-4 items-center border-b border-slate-100 text-left">
                            <img src={meta.thumbnail} className="w-24 aspect-video object-cover rounded-xl shadow-sm" alt="" />
                            <p className="text-sm font-bold text-slate-700 line-clamp-2 italic">{meta.title}</p>
                        </div>

                        <div className="px-6 py-4 border-b border-slate-100 bg-red-50/30 text-left">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">Ready to Repurpose?</p>
                                <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">AI PRO</span>
                            </div>
                            <button
                                onClick={handleRemixClick}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 text-sm active:scale-95 font-black"
                            >
                                <Sparkles size={18} strokeWidth={3} />
                                Rewrite with AI Remix
                            </button>
                        </div>

                        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50">
                            <div className="relative w-full sm:w-64 text-left">
                                <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select
                                    disabled={loadingContent}
                                    value={selectedLang}
                                    onChange={(e) => handleLangChange(e.target.value)}
                                    className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-black text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-red-500/20 transition-all"
                                >
                                    {meta.languages.map(l => <option key={l.code} value={l.code}>{l.label} {l.is_auto ? '(Auto)' : ''}</option>)}
                                </select>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                                {(["time", "text"] as const).map((m) => (
                                    <button key={m} onClick={() => setView(m)} className={`flex-1 sm:flex-none px-6 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === m ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{m}</button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[500px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 bg-white">
                            {loadingContent ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Loader2 className="animate-spin" size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Processing Stream...</p>
                                </div>
                            ) : segments.length > 0 ? (
                                <div className="animate-in fade-in duration-500 text-left">
                                    {view === "time" ? (
                                        <div className="space-y-6">
                                            {segments.map((item, i) => (
                                                <div key={i} className="flex gap-4 group">
                                                    <span className="font-mono text-[10px] text-red-500/60 font-black tabular-nums shrink-0 mt-1">{item.t}</span>
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors select-text">{item.txt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <div className="text-sm text-slate-700 font-medium leading-loose select-text whitespace-pre-wrap">{fullText}</div>}
                                </div>
                            ) : (
                                <button
                                    onClick={() => fetchContentWithCheck(selectedLang, inputUrl)}
                                    className="h-full w-full flex flex-col items-center justify-center text-slate-300 hover:text-red-500 transition-colors group"
                                >
                                    <RefreshCcw size={40} className="mb-4 group-hover:rotate-180 transition-transform duration-500" />
                                    <p className="text-xs font-bold uppercase tracking-widest font-black">Request Failed. Click to Retry.</p>
                                </button>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 grid grid-cols-4 gap-3 bg-white">
                            <button disabled={loadingContent || segments.length === 0} onClick={copyToClipboard} className="col-span-2 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:bg-slate-200 uppercase text-[11px] tracking-widest font-black">
                                <ClipboardPaste size={16} /> Copy
                            </button>
                            <button disabled={loadingContent || segments.length === 0 || isDownloadingSrt} onClick={() => handleDownload('srt')} className="col-span-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-50">
                                {isDownloadingSrt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                                <span className="text-[8px] mt-1 font-black uppercase font-black">SRT</span>
                            </button>
                            <button disabled={loadingContent || segments.length === 0 || isDownloadingTxt} onClick={() => handleDownload('txt')} className="col-span-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all disabled:opacity-50">
                                {isDownloadingTxt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                                <span className="text-[8px] mt-1 font-black uppercase font-black">TXT</span>
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