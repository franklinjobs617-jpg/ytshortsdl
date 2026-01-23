"use client";

import React, { useState, useEffect } from 'react';
import { FileText, X, Download, ClipboardPaste, Loader2, Languages, AlertCircle } from 'lucide-react';
import { saveAs } from "file-saver";
import { useRouter } from 'next/navigation';

interface Language { code: string; label: string; is_auto: boolean; }
interface Segment { t: string; txt: string; }
interface TranscriptMeta { id: string; title: string; thumbnail: string; languages: Language[]; default_lang: string; }

interface TranscriptDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    video: any;
    addToast: (msg: string, type?: 'success' | 'error') => void;
}

const API_BASE = "https://ytdlp.vistaflyer.com";

const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({ isOpen, onClose, video, addToast }) => {
    const router = useRouter();
    const [view, setView] = useState<"time" | "text">("time");
    const [selectedLang, setSelectedLang] = useState("");
    const [meta, setMeta] = useState<TranscriptMeta | null>(null);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [fullText, setFullText] = useState("");

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const [isDownloadingSrt, setIsDownloadingSrt] = useState(false);
    const [isDownloadingTxt, setIsDownloadingTxt] = useState(false);

    useEffect(() => {
        if (isOpen && video?.targetUrl) {
            fetchInfo();
        } else {
            setMeta(null);
            setSegments([]);
            setSelectedLang("");
        }
    }, [isOpen, video?.targetUrl]);

    useEffect(() => {
        if (selectedLang && video?.targetUrl) {
            fetchContent(selectedLang);
        }
    }, [selectedLang, video?.targetUrl]);

    const fetchInfo = async () => {
        setLoadingMeta(true);
        try {
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: video.targetUrl })
            });
            if (!res.ok) throw new Error("Failed to get info");
            const data: TranscriptMeta = await res.json();
            setMeta(data);
            setSelectedLang(data.default_lang);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMeta(false);
        }
    };

    const fetchContent = async (langCode: string) => {
        setLoadingContent(true);
        try {
            const res = await fetch(`${API_BASE}/api/transcript/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: video.targetUrl, lang: langCode })
            });
            if (!res.ok) throw new Error("Failed to load content");
            const data = await res.json();
            setSegments(data.segments);
            setFullText(data.full_text);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingContent(false);
        }
    };

    // --- 核心逻辑修复：支持“有数据秒开”或“没数据自动抓取” ---
    const handleRemixClick = () => {
        if (!video?.targetUrl) return;

        // 构建数据包
        const transportPackage = {
            url: video.targetUrl,
            // 如果这些还没加载出来，它们就是 null
            meta: meta,
            segments: segments,
            fullText: fullText,
            selectedLang: selectedLang
        };

        // 存入会话，即使内容是空的也没关系
        sessionStorage.setItem('pending_remix_data', JSON.stringify(transportPackage));

        onClose();
        router.push('/ai-script-generator');
    };

    const copyToClipboard = () => {
        const textToCopy = view === "time" ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n') : fullText;
        navigator.clipboard.writeText(textToCopy);
        addToast("Copied!", "success");
    };

    const handleDownload = async (type: 'srt' | 'txt') => {
        if (type === 'srt') setIsDownloadingSrt(true); else setIsDownloadingTxt(true);
        try {
            const downloadUrl = `${API_BASE}/api/transcript/download?url=${encodeURIComponent(video.targetUrl)}&lang=${selectedLang}&type=${type}`;
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            saveAs(blob, `${(video?.title || 'transcript').replace(/[\\/:*?"<>|]/g, '_')}.${type}`);
            addToast("Success", "success");
        } catch (err) {
            addToast("Error", "error");
        } finally {
            if (type === 'srt') setIsDownloadingSrt(false); else setIsDownloadingTxt(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-150 transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                {/* Header */}
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
                    {video && <><img src={video.thumbnail} className="w-20 aspect-video object-cover rounded-lg shadow-sm" alt="" /><p className="text-xs font-bold text-slate-600 line-clamp-2 italic">{video.title}</p></>}
                </div>

                {/* Remix 按钮 */}
                <div className="px-6 py-4 border-t border-slate-100 bg-red-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">Repurpose Content</p>
                        <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">AI PRO</span>
                    </div>
                    <button
                        onClick={handleRemixClick}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 text-sm active:scale-95"
                    >
                        <FileText size={18} strokeWidth={3} />
                        Rewrite with AI Remix
                    </button>
                </div>

                {/* Control Panel */}
                <div className="px-6 py-4 flex items-center justify-between gap-3 border-b border-slate-50">
                    <div className="relative flex-1">
                        <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select disabled={loadingMeta || !meta} value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-black text-slate-700 outline-none appearance-none cursor-pointer">
                            {meta?.languages.map(l => <option key={l.code} value={l.code}>{l.label} {l.is_auto ? '(Auto)' : ''}</option>)}
                        </select>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(["time", "text"] as const).map((mode) => (
                            <button key={mode} onClick={() => setView(mode)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === mode ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>{mode}</button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="grow overflow-y-auto p-6 scrollbar-thin">
                    {loadingMeta || loadingContent ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3"><Loader2 className="animate-spin" size={32} /><p className="text-[10px] font-black uppercase tracking-widest">Loading...</p></div>
                    ) : segments.length > 0 ? (
                        <div className="animate-in fade-in duration-500">
                            {view === "time" ? (
                                <div className="space-y-6">{segments.map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <span className="font-mono text-[10px] text-red-500/60 font-black shrink-0 mt-1">{item.t}</span>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors">{item.txt}</p>
                                    </div>
                                ))}</div>
                            ) : <div className="text-sm text-slate-700 font-medium leading-loose whitespace-pre-wrap">{fullText}</div>}
                        </div>
                    ) : <div className="h-full flex flex-col items-center justify-center text-slate-300"><AlertCircle size={40} className="mb-4" /><p className="text-xs font-bold uppercase tracking-widest">No Transcript</p></div>}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-100 grid grid-cols-4 gap-3 bg-white">
                    <button disabled={loadingContent || segments.length === 0} onClick={copyToClipboard} className="col-span-2 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:bg-slate-200 uppercase text-[11px] tracking-widest tracking-widest">Copy</button>
                    <button disabled={loadingContent || segments.length === 0 || isDownloadingSrt} onClick={() => handleDownload('srt')} className="col-span-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all">
                        {isDownloadingSrt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        <span className="text-[8px] mt-1 font-black">SRT</span>
                    </button>
                    <button disabled={loadingContent || segments.length === 0 || isDownloadingTxt} onClick={() => handleDownload('txt')} className="col-span-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center transition-all">
                        {isDownloadingTxt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        <span className="text-[8px] mt-1 font-black">TXT</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TranscriptDrawer;