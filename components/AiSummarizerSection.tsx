"use client";
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Loader2, Link as LinkIcon, ShieldCheck,
    FileText, Sparkles, Languages, RefreshCcw, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { saveAs } from "file-saver";
import { useAuth } from '@/lib/auth-context';
import SubscriptionModal from "@/components/SubscriptionModal";

const API_BASE = "https://ytdlp.vistaflyer.com";

// --- Markdown 渲染器 ---
const MarkdownRenderer = ({ text }: { text: string }) => {
    const renderLine = (line: string, index: number) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;
        if (trimmed.startsWith('## ')) return <h2 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-3">{trimmed.replace('## ', '')}</h2>;
        if (trimmed.startsWith('### ')) return <h3 key={index} className="text-lg font-bold text-slate-800 mt-4 mb-2">{trimmed.replace('### ', '')}</h3>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
            const isOrdered = /^\d+\.\s/.test(trimmed);
            return (
                <div key={index} className="flex gap-2 ml-4 my-1 text-slate-700 text-left">
                    <span className="shrink-0 font-bold text-red-500">{isOrdered ? trimmed.match(/^\d+\./)?.[0] : "•"}</span>
                    <p>{trimmed.replace(/^([-*]|\d+\.)\s+/, '')}</p>
                </div>
            );
        }
        return <p key={index} className="text-slate-700 leading-relaxed text-base mb-2 text-left">{trimmed}</p>;
    };
    return <div>{text.split('\n').map((line, i) => renderLine(line, i))}</div>;
};

export default function AiSummarizerSection() {
    const { user, credits, consumeUsage, checkQuota, isLoggedIn, login } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPayLoading, setIsPayLoading] = useState(false);

    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSummaryFailed, setIsSummaryFailed] = useState(false);
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);
    const [selectedLang, setSelectedLang] = useState("");
    const [segments, setSegments] = useState<any[]>([]);
    const [fullText, setFullText] = useState("");
    const [aiReasoning, setAiReasoning] = useState("");
    const [aiSummary, setAiSummary] = useState("");
    const [view, setView] = useState<"summary" | "transcript">("summary");
    const [transcriptMode, setTranscriptMode] = useState<"time" | "text">("time");

    const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
    const hasInited = useRef(false);

    const addToast = (message: string, type: 'success' | 'error' = 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
    };

    const handleUpgradeClick = async (typeString: string) => {
        if (!isLoggedIn) {
            login();
            return;
        }

        setIsPayLoading(true);
        try {
            const res = await fetch('/api/pay/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    googleUserId: user?.googleUserId,
                    email: user?.email,
                    userId: user?.id,
                    type: typeString
                })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                addToast("Payment gateway is busy, please try again.", "error");
            }
        } catch (error) {
            addToast("Connection error, please try again.", "error");
        } finally {
            setIsPayLoading(false);
        }
    };

    const resetAiStates = () => {
        setAiSummary("");
        setAiReasoning("");
        setIsSummaryFailed(false);
        setIsReasoningExpanded(false);
    };

    // 1. AI 流式总结逻辑
    const startAiStreaming = async (text: string) => {
        if (!text) return;

        // Quota Check
        const canSummarize = await checkQuota('summary');
        if (!canSummarize) {
            setIsModalOpen(true);
            return;
        }

        setIsSummarizing(true);
        setIsSummaryFailed(false);
        resetAiStates();

        try {
            const response = await fetch('/api/summare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text.substring(0, 12000) })
            });

            if (!response.ok) {
                throw new Error(`Summary API Error: ${response.status}`);
            }

            // Deduct Credit only on success
            await consumeUsage('summary');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
                const { value, done } = await reader!.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";
                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const data = line.replace("data: ", "");
                    if (data === "[DONE]") break;
                    try {
                        const json = JSON.parse(data);
                        const delta = json.choices[0].delta;
                        if (delta.reasoning_content) setAiReasoning(p => p + delta.reasoning_content);
                        if (delta.content) setAiSummary(p => p + delta.content);
                    } catch (e) { }
                }
            }
        } catch (err: any) {
            console.error(err);
            setIsSummaryFailed(true);
            addToast("AI Summary generation failed", "error");
        } finally {
            setIsSummarizing(false);
        }
    };

    // 2. 带扣费检查的 Content 获取逻辑
    const fetchContentWithCheck = async (targetUrl: string, langCode: string) => {
        // Check 1: Local credits
        if (credits <= 0) {
            setIsModalOpen(true);
            setIsLoading(false); // 🚀 FIX: Reset loading state if blocked
            return;
        }

        // Check 2: Server quota
        const canExtract = await checkQuota('extract');
        if (!canExtract) {
            setIsModalOpen(true);
            setIsLoading(false); // 🚀 FIX: Reset loading state if blocked
            return;
        }

        setIsLoading(true);
        setSegments([]);
        setFullText("");
        resetAiStates();

        try {
            const res = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl, lang: langCode })
            });

            if (!res.ok) throw new Error("Server temporary error (500).");

            const data = await res.json();

            await consumeUsage('extract');

            setSegments(data.segments || []);
            setFullText(data.full_text || "");
            setIsLoading(false);

            await startAiStreaming(data.full_text);
        } catch (err: any) {
            addToast(err.message, "error");
            setIsLoading(false);
            setSegments([]);
        }
    };

    // 3. 初始解析
    const handleInitialExtract = useCallback(async (targetUrl?: string) => {
        const fetchUrl = targetUrl || url.trim();
        if (!fetchUrl) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: fetchUrl })
            });
            if (!res.ok) throw new Error("Video info not found.");
            const info = await res.json();
            setVideoData(info);
            setSelectedLang(info.default_lang);
            await fetchContentWithCheck(fetchUrl, info.default_lang);
        } catch (err: any) {
            addToast(err.message, "error");
            setIsLoading(false);
        }
    }, [url, credits]);

    useEffect(() => {
        if (hasInited.current) return;
        const incomingStr = sessionStorage.getItem('pending_remix_data');
        if (incomingStr) {
            try {
                const data = JSON.parse(incomingStr);
                setUrl(data.url);
                if (data.meta && data.fullText) {
                    setVideoData(data.meta);
                    setSegments(data.segments);
                    setFullText(data.fullText);
                    setSelectedLang(data.selectedLang);
                    startAiStreaming(data.fullText);
                } else {
                    handleInitialExtract(data.url);
                }
                hasInited.current = true;
                sessionStorage.removeItem('pending_remix_data');
            } catch (e) { }
        }
    }, [handleInitialExtract]);

    const handleCopy = () => {
        const text = view === "summary" ? aiSummary : (transcriptMode === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText);
        if (text) { navigator.clipboard.writeText(text); addToast("Copied", "success"); }
    };

    const handleExport = () => {
        const text = view === "summary" ? aiSummary : (transcriptMode === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText);
        if (!text) return;
        saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), `${videoData?.title || 'script'}.txt`);
    };

    return (
        <section className="relative">
            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpgrade={handleUpgradeClick}
                isLoading={isPayLoading}
            />

            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none w-xs md:w-lg max-sm px-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-slate-900' : 'bg-green-600'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto mb-3 border border-white/10 w-full`}>
                        <span className={toast.type === 'error' ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{toast.type === 'error' ? '●' : '✓'}</span>
                        <span className="font-bold text-xs">{toast.message}</span>
                    </div>
                ))}
            </div>

            <div className="glow-effect -z-10"></div>
            <div className="relative py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        YouTube video <span className="text-red-600">AI Script Generator</span>
                    </h1>
                    <p className="text-slate-500 text-sm">Instant insights and transcripts powered by AI.</p>
                </div>

                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-100">
                        <form onSubmit={(e) => { e.preventDefault(); handleInitialExtract(); }} className="flex flex-col md:flex-row items-stretch gap-3">
                            <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 focus-within:bg-white transition-all px-4 items-center h-12">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste Youtube link here..." required className="grow bg-transparent outline-none text-slate-800 font-bold text-sm" />
                            </div>
                            <button type="submit" disabled={isLoading || isSummarizing} className="md:w-52 h-12 rounded-2xl font-black bg-red-600 text-white hover:bg-red-700 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all">
                                {(isLoading || isSummarizing) ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} <span>Generate</span>
                            </button>
                        </form>
                    </div>
                </div>

                {videoData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="lg:col-span-1 space-y-6 text-left">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                                <img src={videoData.thumbnail} className="w-full aspect-video object-cover" alt="" />
                                <div className="p-6">
                                    <h3 className="font-bold text-slate-800 mb-6 line-clamp-2 italic leading-snug tracking-tight">{videoData.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                                        <Languages size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Select Language</span>
                                    </div>
                                    <select
                                        disabled={isLoading || isSummarizing}
                                        value={selectedLang}
                                        onChange={(e) => fetchContentWithCheck(url, e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none"
                                    >
                                        {videoData.languages?.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => fetchContentWithCheck(url, selectedLang)} disabled={isLoading || isSummarizing} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-tighter">
                                <RefreshCcw size={16} className={(isLoading || isSummarizing) ? "animate-spin" : ""} /> {isLoading ? "Updating..." : "Generate Again"}
                            </button>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[32px] shadow-2xl flex flex-col h-[650px] overflow-hidden p-2 border border-slate-100 relative">

                                <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 backdrop-blur-sm border border-white shadow-inner">
                                    <button onClick={() => setView("summary")} className={`flex-1 py-3 text-xs md:text-sm rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${view === 'summary' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}><Sparkles size={16} /> AI SUMMARY</button>
                                    <button onClick={() => setView("transcript")} className={`flex-1 py-3 text-xs md:text-sm  rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${view === 'transcript' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}><FileText size={16} /> TRANSCRIPT</button>
                                </div>

                                {view === "transcript" && !isLoading && segments.length > 0 && (
                                    <div className="px-6 py-2 flex justify-end gap-2 border-b border-slate-50 animate-in slide-in-from-top-1">
                                        <button onClick={() => setTranscriptMode("time")} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${transcriptMode === 'time' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-400'}`}>TIME</button>
                                        <button onClick={() => setTranscriptMode("text")} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${transcriptMode === 'text' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-400'}`}>TEXT</button>
                                    </div>
                                )}

                                <div className="grow overflow-y-auto p-6 text-left scrollbar-thin flex flex-col">
                                    {isLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[300px]"><Loader2 className="animate-spin" size={32} /><p className="text-[10px] font-black uppercase tracking-widest">Loading Data...</p></div>
                                    ) : segments.length === 0 ? (
                                        <button onClick={() => fetchContentWithCheck(url, selectedLang)} className="h-full w-full flex flex-col items-center justify-center text-slate-300 hover:text-red-500 transition-all duration-300 group p-12 min-h-[300px]">
                                            <RefreshCcw size={48} className="mb-4 group-hover:rotate-180 transition-transform duration-500" /><p className="text-sm font-black uppercase tracking-widest leading-none">Request Failed</p><span className="text-[10px] mt-2 font-bold opacity-60 underline">Click to retry</span>
                                        </button>
                                    ) : view === "summary" ? (
                                        <>
                                            {isSummaryFailed ? (
                                                <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 gap-4 animate-in fade-in">
                                                    <RefreshCcw size={48} className="mb-2" />
                                                    <div className="text-center">
                                                        <p className="text-sm font-black uppercase tracking-widest leading-none mb-2">Request Failed</p>
                                                        <button
                                                            onClick={() => startAiStreaming(fullText)}
                                                            className="text-[10px] font-bold text-red-500 hover:text-red-600 underline underline-offset-4 uppercase tracking-widest"
                                                        >
                                                            Click to retry summary
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {aiReasoning && (
                                                        <div className="rounded-2xl border border-slate-100 border-dashed overflow-hidden">
                                                            <button onClick={() => setIsReasoningExpanded(!isReasoningExpanded)} className="w-full flex items-center justify-between p-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                                                                <span>AI Thinking Process</span>{isReasoningExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                            </button>
                                                            {isReasoningExpanded && <div className="p-4 text-xs text-slate-400 italic whitespace-pre-wrap leading-relaxed">{aiReasoning}</div>}
                                                        </div>
                                                    )}
                                                    <div className="prose prose-slate max-w-none">
                                                        {!aiSummary && isSummarizing && (
                                                            <div className="flex flex-col items-center justify-center h-40 text-slate-300 gap-3"><Loader2 className="animate-spin" size={30} /><span className="text-xs font-bold uppercase tracking-widest italic text-center">AI is analyzing script...</span></div>
                                                        )}
                                                        <MarkdownRenderer text={aiSummary} />
                                                        {isSummarizing && aiSummary && <span className="inline-block w-2 h-5 ml-1 bg-red-500 animate-pulse" />}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="space-y-6">
                                            {transcriptMode === "time" ? segments.map((s, i) => (
                                                <div key={i} className="flex gap-4 group text-left">
                                                    <span className="font-mono text-[10px] text-red-500/60 font-black shrink-0 mt-1 tabular-nums">{s.t}</span>
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors select-text">{s.txt}</p>
                                                </div>
                                            )) : <p className="text-sm text-slate-700 font-medium leading-[2.2] whitespace-pre-wrap select-text px-2">{fullText}</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-50 bg-white grid grid-cols-2 gap-4">
                                    <button onClick={handleCopy} disabled={isLoading || (view === 'summary' && !aiSummary || view === 'transcript' && segments.length === 0)}
                                        className="py-4 bg-slate-900 text-white text-sm font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all uppercase tracking-tighter disabled:opacity-30 shadow-lg">
                                        Copy Content
                                    </button>
                                    <button onClick={handleExport} disabled={isLoading || (view === 'summary' && !aiSummary || view === 'transcript' && segments.length === 0)} className="py-4 bg-white border border-slate-200 text-sm text-slate-700 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-tighter disabled:opacity-30">Export TXT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-xs text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" /> Secure AI processing using Volcano Ark Engine.
                </div>

                <div className="pt-12 flex flex-col items-center max-w-6xl mx-auto">
                    <span className="text-slate-400 mb-4 font-bold text-sm">Professional Creator Suite</span>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">📽️</span>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 01</p>
                                <p className="text-sm font-black">Download Shorts</p>
                            </div>
                        </Link>
                        <Link href="/shorts-to-mp3" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">🎵</span>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 02</p>
                                <p className="text-sm font-black">Extract MP3</p>
                            </div>
                        </Link>
                        <Link href="/video-to-script-converter" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">🤖</span>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 03</p>
                                <p className="text-sm font-black">Video to Script</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}