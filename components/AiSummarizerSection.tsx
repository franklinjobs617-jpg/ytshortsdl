"use client";
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Loader2, Link as LinkIcon, ShieldCheck,
    FileText, Sparkles, Languages,
    ClipboardPaste, Download, RefreshCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import { saveAs } from "file-saver";

const API_BASE = "https://ytdlp.vistaflyer.com";

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
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
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

    const resetAiStates = () => {
        setAiSummary("");
        setAiReasoning("");
        setIsReasoningExpanded(false);
    };

    const startAiStreaming = async (text: string) => {
        if (!text) return;
        setIsSummarizing(true);
        resetAiStates();
        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text.substring(0, 12000) })
            });
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
            addToast("AI analysis failed", "error");
        } finally {
            setIsSummarizing(false);
        }
    };

    // 核心解析函数：自动获取元数据 -> 内容 -> 触发 AI
    const handleExtract = useCallback(async (targetUrl?: string) => {
        const fetchUrl = targetUrl || url.trim();
        if (!fetchUrl) return;
        setIsLoading(true);
        resetAiStates();
        try {
            // 1. 获取视频元数据 (Info)
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: fetchUrl })
            });
            if (!res.ok) throw new Error("Transcript unavailable.");
            const info = await res.json();
            setVideoData(info);
            setSelectedLang(info.default_lang);

            // 2. 获取具体内容 (Content)
            const res2 = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: fetchUrl, lang: info.default_lang })
            });
            const content = await res2.json();
            setSegments(content.segments);
            setFullText(content.full_text);

            // 3. 触发总结
            await startAiStreaming(content.full_text);
        } catch (err: any) {
            addToast(err.message, "error");
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    // --- 智能初始化逻辑：检查会话存储 ---
    useEffect(() => {
        if (hasInited.current) return;
        const incomingStr = sessionStorage.getItem('pending_remix_data');

        if (incomingStr) {
            try {
                const data = JSON.parse(incomingStr);
                setUrl(data.url);

                // 判断数据是否完整 (包含 meta 和 fullText)
                if (data.meta && data.fullText) {
                    // 数据完整：直接填充 UI 并开始 AI
                    setVideoData(data.meta);
                    setSegments(data.segments);
                    setFullText(data.fullText);
                    setSelectedLang(data.selectedLang);
                    startAiStreaming(data.fullText);
                    addToast("Content restored from drawer", "success");
                } else {
                    // 数据不完整 (只有 URL)：自动触发完整解析逻辑
                    handleExtract(data.url);
                }

                hasInited.current = true;
                sessionStorage.removeItem('pending_remix_data');
            } catch (e) {
                console.error("Session sync failed", e);
            }
        }
    }, [handleExtract]);

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
            {/* Toast */}
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
                        <form onSubmit={(e) => { e.preventDefault(); handleExtract(); }} className="flex flex-col md:flex-row items-stretch gap-3">
                            <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 focus-within:bg-white transition-all px-4 items-center h-12">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste Youtube link here..." required className="grow bg-transparent outline-none text-slate-800 font-bold" />
                            </div>
                            <button type="submit" disabled={isLoading || isSummarizing} className="md:w-52 h-12 rounded-2xl font-black bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-50">
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
                                    <h3 className="font-bold text-slate-800 mb-6 line-clamp-2 italic tracking-tight leading-snug">{videoData.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                                        <Languages size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Select Language</span>
                                    </div>
                                    <select value={selectedLang} onChange={(e) => handleExtract(url)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none">
                                        {videoData.languages?.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => handleExtract(url)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">Generate Again</button>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[32px] shadow-2xl flex flex-col h-[650px] overflow-hidden p-2 border border-slate-100">
                                <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 backdrop-blur-sm border border-white shadow-inner">
                                    <button onClick={() => setView("summary")} className={`flex-1 py-3 text-xs md:text-sm rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${view === 'summary' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}><Sparkles size={16} /> AI SUMMARY</button>
                                    <button onClick={() => setView("transcript")} className={`flex-1 py-3 text-xs md:text-sm  rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${view === 'transcript' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}><FileText size={16} /> TRANSCRIPT</button>
                                </div>
                                <div className="grow overflow-y-auto p-6 text-left scrollbar-thin">
                                    {view === "summary" ? (
                                        <div className="space-y-4">
                                            {aiReasoning && (
                                                <div className="rounded-2xl border border-slate-100 border-dashed overflow-hidden">
                                                    <button onClick={() => setIsReasoningExpanded(!isReasoningExpanded)} className="w-full flex items-center justify-between p-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                                                        <span>AI Process Check</span>
                                                        {isReasoningExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                    {isReasoningExpanded && <div className="p-4 text-xs text-slate-400 italic whitespace-pre-wrap leading-relaxed">{aiReasoning}</div>}
                                                </div>
                                            )}
                                            <div className="prose prose-slate max-w-none">
                                                {!aiSummary && isSummarizing && <div className="flex flex-col items-center justify-center h-40 text-slate-300 gap-3"><Loader2 className="animate-spin" size={30} /><span className="text-xs font-bold uppercase tracking-widest italic">AI Analysis...</span></div>}
                                                <MarkdownRenderer text={aiSummary} />
                                                {isSummarizing && aiSummary && <span className="inline-block w-2 h-5 ml-1 bg-red-500 animate-pulse" />}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {segments.map((s, i) => (
                                                <div key={i} className="flex gap-4 group">
                                                    <span className="font-mono text-[10px] text-red-500/60 font-black shrink-0 mt-1">{s.t}</span>
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors">{s.txt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-50 bg-white grid grid-cols-2 gap-4">
                                    <button onClick={handleCopy} className="py-4 bg-slate-900 text-white text-sm font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all uppercase tracking-tighter">Copy Content</button>
                                    <button onClick={handleExport} className="py-4 bg-white border border-slate-200 text-sm text-slate-700 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-tighter">Export TXT</button>
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