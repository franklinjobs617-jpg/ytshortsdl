"use client";
import Link from 'next/link';
import { useState } from 'react';
import {
    Loader2, Link as LinkIcon, ShieldCheck,
    AlertCircle, FileText, Sparkles, Languages,
    ClipboardPaste, Download, RefreshCcw, ChevronDown, ChevronUp
} from 'lucide-react';

const API_BASE = "https://ytdlp.vistaflyer.com";

interface Language { code: string; label: string; is_auto: boolean; }
interface Segment { t: string; txt: string; }
interface VideoData { id: string; title: string; thumbnail: string; languages: Language[]; default_lang: string; }

// --- 修复后的 Markdown 渲染器 ---
const MarkdownRenderer = ({ text }: { text: string }) => {
    const renderLine = (line: string, index: number) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        // 处理标题
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-3">{trimmed.replace('## ', '')}</h2>;
        }
        if (trimmed.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-bold text-slate-800 mt-4 mb-2">{trimmed.replace('### ', '')}</h3>;
        }

        // 处理列表
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
            const isOrdered = /^\d+\.\s/.test(trimmed);
            const content = trimmed.replace(/^([-*]|\d+\.)\s+/, '');
            return (
                <div key={index} className="flex gap-2 ml-4 my-1 text-slate-700">
                    <span className="shrink-0 font-bold text-red-500">{isOrdered ? trimmed.match(/^\d+\./)?.[0] : "•"}</span>
                    <p>{renderBold(content)}</p>
                </div>
            );
        }

        // 默认段落
        return <p key={index} className="text-slate-700 leading-relaxed text-base mb-2">{renderBold(trimmed)}</p>;
    };

    const renderBold = (str: string) => {
        return str.split(/(\*\*.*?\*\*)/g).map((part, i) => (
            part.startsWith('**') && part.endsWith('**')
                ? <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
                : part
        ));
    };

    return <div>{text.split('\n').map((line, i) => renderLine(line, i))}</div>;
};

export default function AiSummarizerSection() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(false); // 默认不展开

    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [selectedLang, setSelectedLang] = useState("");
    const [segments, setSegments] = useState<Segment[]>([]);
    const [fullText, setFullText] = useState("");

    const [aiReasoning, setAiReasoning] = useState("");
    const [aiSummary, setAiSummary] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"summary" | "transcript">("summary");
    const [transcriptMode, setTranscriptMode] = useState<"time" | "text">("time");

    // 1. 获取视频元数据
    const handleExtract = async (targetUrl?: string) => {
        const fetchUrl = targetUrl || url.trim();
        if (!fetchUrl) return;

        setIsLoading(true);
        setError(null);
        resetAiStates();

        try {
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: fetchUrl })
            });
            if (!res.ok) throw new Error("Video transcript not available.");
            const data: VideoData = await res.json();
            setVideoData(data);
            setSelectedLang(data.default_lang);
            if (data.default_lang) await fetchTranscriptContent(fetchUrl, data.default_lang);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. 获取字幕内容并触发流式AI
    const fetchTranscriptContent = async (targetUrl: string, langCode: string) => {
        resetAiStates();
        setIsSummarizing(true);
        try {
            const res = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl, lang: langCode })
            });
            if (!res.ok) throw new Error("Failed to load transcript.");
            const data = await res.json();
            setSegments(data.segments);
            setFullText(data.full_text);
            await startAiStreaming(data.full_text);
        } catch (err: any) {
            setError(err.message);
            setIsSummarizing(false);
        }
    };

    // 3. 流式解析 (打字机)
    const startAiStreaming = async (text: string) => {
        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text.substring(0, 12000) })
            });
            if (!response.ok) throw new Error("AI Server Error");

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
                    } catch (e) { /* Buffer fragment */ }
                }
            }
        } catch (err: any) {
            setError("Summarization failed: " + err.message);
        } finally {
            setIsSummarizing(false);
        }
    };

    const resetAiStates = () => {
        setAiSummary("");
        setAiReasoning("");
        setIsReasoningExpanded(false);
    };

    const handleLangChange = (newLang: string) => {
        setSelectedLang(newLang);
        if (videoData) fetchTranscriptContent(url, newLang);
    };

    const handleCopy = () => {
        let content = view === "summary" ? aiSummary : (transcriptMode === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText);
        navigator.clipboard.writeText(content);
        // addtoast("Content copied to clipboard!", { type: "success" });
    };

    const handleExport = () => {
        let content = view === "summary" ? aiSummary : (transcriptMode === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText);
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${videoData?.title || 'video'}_${view}.txt`;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
    };

    return (
        <section className="relative">
            <div className="glow-effect -z-10"></div>
            <div className="relative py-20 px-4 max-w-7xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        YouTube video <span className="text-red-600">AI Summarizer</span>
                    </h1>
                    <p className="text-slate-500 text-sm">Instant insights and transcripts powered by AI.</p>
                </div>

                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl">
                        <form onSubmit={(e) => { e.preventDefault(); handleExtract(); }} className="flex flex-col md:flex-row items-stretch gap-3">
                            <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all px-4 items-center h-12">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste Youtube video link ..." required className="grow bg-transparent outline-none text-slate-800 font-bold" />
                            </div>
                            <button type="submit" disabled={isLoading} className="md:w-52 h-12 rounded-2xl font-black bg-red-600 text-white hover:bg-red-700 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />} <span>Summarize</span>
                            </button>
                        </form>
                    </div>
                    {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium"><AlertCircle size={18} /> {error}</div>}
                </div>

                {videoData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                                <img src={videoData.thumbnail} className="w-full aspect-video object-cover" alt="" />
                                <div className="p-6 text-left">
                                    <h3 className="font-bold text-slate-800 mb-6 line-clamp-2">{videoData.title}</h3>
                                    <Languages size={14} className="text-slate-400 mb-2" />
                                    <select value={selectedLang} onChange={(e) => handleLangChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none">
                                        {videoData.languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => fetchTranscriptContent(videoData.id, selectedLang)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"><RefreshCcw size={16} /> Summarize Again</button>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-2xl flex flex-col h-140 md:h-180 overflow-hidden p-2">
                                <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 backdrop-blur-sm border border-white shadow-inner">
                                    <button
                                        onClick={() => setView("summary")}
                                        className={`flex-1 py-3 text-xs md:text-sm rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${view === 'summary' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>
                                        <Sparkles size={16} /> AI SUMMARY
                                    </button>
                                    <button
                                        onClick={() => setView("transcript")}
                                        className={`flex-1 py-3 text-xs md:text-sm  rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${view === 'transcript' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>
                                        <FileText size={16} /> TRANSCRIPT
                                    </button>
                                </div>

                                {view === "transcript" && (
                                    <div className="px-8 py-2 flex justify-end bg-white border-b border-slate-50 gap-2">
                                        <button onClick={() => setTranscriptMode("time")} className={`px-3 py-1 text-[10px] font-bold rounded-md ${transcriptMode === 'time' ? 'bg-red-50 text-red-600' : 'text-slate-400'}`}>TIME</button>
                                        <button onClick={() => setTranscriptMode("text")} className={`px-3 py-1 text-[10px] font-bold rounded-md ${transcriptMode === 'text' ? 'bg-red-50 text-red-600' : 'text-slate-400'}`}>TEXT</button>
                                    </div>
                                )}

                                <div className="grow overflow-y-auto p-4 text-left scrollbar-thin">
                                    {view === "summary" ? (
                                        <div className="space-y-4">
                                            {aiReasoning && (
                                                <div className="rounded-2xl border border-slate-100 border-dashed overflow-hidden">
                                                    <button onClick={() => setIsReasoningExpanded(!isReasoningExpanded)} className="w-full flex items-center justify-between p-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                                                        <span className="flex items-center gap-2">{(isSummarizing && !aiSummary) && <Loader2 size={10} className="animate-spin" />} AI Thinking Process</span>
                                                        {isReasoningExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                    {isReasoningExpanded && <div className="p-4 bg-slate-50/50 text-xs text-slate-400 italic whitespace-pre-wrap">{aiReasoning}</div>}
                                                </div>
                                            )}
                                            <div className="prose prose-slate max-w-none">
                                                {!aiSummary && isSummarizing && <div className="flex flex-col items-center justify-center h-40 text-slate-300 gap-3"><Loader2 className="animate-spin" size={30} /><span className="text-xs font-bold uppercase">AI is analyzing...</span></div>}
                                                <MarkdownRenderer text={aiSummary} />
                                                {isSummarizing && aiSummary && <span className="inline-block w-2 h-5 ml-1 bg-red-500 animate-pulse align-middle" />}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {transcriptMode === "time" ? segments.map((s, i) => (
                                                <div key={i} className="flex gap-4 group">
                                                    <span className="font-mono text-[10px] text-red-500/60 font-black shrink-0 mt-1">{s.t}</span>
                                                    <p className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-950 transition-colors">{s.txt}</p>
                                                </div>
                                            )) : <p className="text-sm text-slate-600 leading-loose whitespace-pre-wrap">{fullText}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-slate-50 bg-white grid grid-cols-2 gap-4">
                                    <button onClick={handleCopy} className="py-4 bg-slate-900 text-white text-sm md:text-base font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all"><ClipboardPaste size={18} /> Copy Content</button>
                                    <button onClick={handleExport} className="py-4 bg-white border border-slate-200 text-sm md:text-base text-slate-700 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"><Download size={18} /> Export TXT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-12 text-xs text-slate-400 flex items-center justify-center gap-2"><ShieldCheck size={14} className="text-green-500" /> Secure AI processing using Volcano Ark Engine.</div>
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
                        <Link href="/video-to-script-converter" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">🤖</span>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 03</p>
                                <p className="text-sm font-black">Video to Script</p></div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}