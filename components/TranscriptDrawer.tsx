"use client";

import React, { useState, useEffect } from 'react';
import { FileText, X, Download, ClipboardPaste, Loader2, Languages, AlertCircle } from 'lucide-react';
import { saveAs } from "file-saver";
import Link from 'next/link';
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

interface TranscriptDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    video: any; // 修改为接收完整的 video 对象
    addToast: (msg: string, type?: 'success' | 'error') => void;
}

const API_BASE = "https://ytdlp.vistaflyer.com";

const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({ isOpen, onClose, video, addToast }) => {
    const [view, setView] = useState<"time" | "text">("time");
    const [selectedLang, setSelectedLang] = useState("");
    const [meta, setMeta] = useState<TranscriptMeta | null>(null);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [fullText, setFullText] = useState("");

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);

    // 独立控制下载按钮的 Loading 状态
    const [isDownloadingSrt, setIsDownloadingSrt] = useState(false);
    const [isDownloadingTxt, setIsDownloadingTxt] = useState(false);

    // 1. 当抽屉打开时，获取语言列表
    useEffect(() => {
        if (isOpen && video?.targetUrl) {
            fetchInfo();
        } else {
            // 关闭时重置状态
            setMeta(null);
            setSegments([]);
            setSelectedLang("");
        }
    }, [isOpen, video?.targetUrl]);

    // 2. 当语言被选择或更改时，获取具体的字幕内容
    useEffect(() => {
        if (selectedLang && video?.targetUrl) {
            fetchContent(selectedLang);
        }
    }, [selectedLang, video?.targetUrl]);

    // 获取语言信息
    const fetchInfo = async () => {
        setLoadingMeta(true);
        try {
            const res = await fetch(`${API_BASE}/api/transcript/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: video.targetUrl })
            });

            if (!res.ok) throw new Error("Failed to get video info");

            const data: TranscriptMeta = await res.json();
            setMeta(data);
            setSelectedLang(data.default_lang);
        } catch (err) {
            addToast("Error fetching video transcript info", "error");
            onClose();
        } finally {
            setLoadingMeta(false);
        }
    };

    // 获取字幕内容
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
            addToast("Failed to load transcript text", "error");
        } finally {
            setLoadingContent(false);
        }
    };

    // 复制到剪贴板
    const copyToClipboard = () => {
        const textToCopy = view === "time"
            ? segments.map(s => `[${s.t}] ${s.txt}`).join('\n')
            : fullText;

        navigator.clipboard.writeText(textToCopy);
        addToast("Copied to clipboard", "success");
    };

    // 下载文件 (SRT 或 TXT) 
    const handleDownload = async (type: 'srt' | 'txt') => {
        // 设置独立按钮状态
        if (type === 'srt') setIsDownloadingSrt(true);
        else setIsDownloadingTxt(true);

        const downloadUrl = `${API_BASE}/api/transcript/download?url=${encodeURIComponent(video.targetUrl)}&lang=${selectedLang}&type=${type}`;

        try {
            const response = await fetch(downloadUrl);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "File generation failed");
            }

            const blob = await response.blob();
            const safeTitle = video?.title ? video.title.replace(/[\\/:*?"<>|]/g, '_') : 'transcript';
            const fileName = `${safeTitle}.${type}`;

            saveAs(blob, fileName);
            addToast(`${type.toUpperCase()} downloaded successfully`, "success");
        } catch (err) {
            console.error("Download Error:", err);
            addToast(err instanceof Error ? err.message : `Failed to download ${type.toUpperCase()}`, "error");
        } finally {
            // 恢复按钮状态
            if (type === 'srt') setIsDownloadingSrt(false);
            else setIsDownloadingTxt(false);
        }
    };

    // 渲染“处理中/加载中”的视图
    const renderLoader = () => (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Processing Stream...</p>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-150 transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            {/* 遮罩 */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* 侧边容器 */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <FileText size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Transcript</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">AI Context Extraction</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} strokeWidth={3} className="text-slate-400" />
                    </button>
                </div>

                {/* 视频元数据展示 - 直接从 props 获取，无需等待接口 */}
                <div className="px-6 py-4 bg-slate-50 flex gap-3 items-center border-b border-slate-100">
                    {video ? (
                        <>
                            <img src={video.thumbnail} className="w-20 aspect-video object-cover rounded-lg shadow-sm" alt="" />
                            <p className="text-xs font-bold text-slate-600 line-clamp-2 italic">{video.title}</p>
                        </>
                    ) : null}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-red-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] font-bold text-slate-800 tracking-widest">Ready to Repurpose?</p>
                        <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">PRO</span>
                    </div>
                    <Link href="/ai-script-generator"
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                        Rewrite with AI Remix
                    </Link>
                </div>

                {/* 控制面板 */}
                <div className="px-6 py-4 flex items-center justify-between gap-3 border-b border-slate-50">
                    <div className="relative flex-1">
                        <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                            disabled={loadingMeta || !meta}
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-black text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {meta?.languages.map(l => (
                                <option key={l.code} value={l.code}>
                                    {l.label} {l.is_auto ? '(Auto)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(["time", "text"] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setView(mode)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === mode ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 字幕内容滚动区 */}
                <div className="grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                    {/* 修改逻辑：Meta 加载中 或 Content 加载中都显示 Loader */}
                    {loadingMeta || loadingContent ? (
                        renderLoader()
                    ) : segments.length > 0 ? (
                        <div className="animate-in fade-in duration-500">
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
                                <div className="text-sm text-slate-700 font-medium leading-loose select-text">
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
                        disabled={loadingContent || segments.length === 0 || isDownloadingSrt || isDownloadingTxt}
                        onClick={copyToClipboard}
                        className="col-span-2 py-4 bg-slate-900 hover:bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:bg-slate-200 disabled:shadow-none uppercase text-[11px] tracking-widest"
                    >
                        <ClipboardPaste size={16} /> Copy
                    </button>

                    {/* SRT 按钮 - 独立 Loading */}
                    <button
                        disabled={loadingContent || segments.length === 0 || isDownloadingSrt}
                        onClick={() => handleDownload('srt')}
                        className={`col-span-1 py-4 font-black rounded-2xl flex flex-col items-center justify-center transition-all 
                            ${isDownloadingSrt ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                        title="Download SRT"
                    >
                        {isDownloadingSrt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        <span className="text-[8px] mt-1 uppercase font-black">{isDownloadingSrt ? '...' : 'SRT'}</span>
                    </button>

                    {/* TXT 按钮 - 独立 Loading */}
                    <button
                        disabled={loadingContent || segments.length === 0 || isDownloadingTxt}
                        onClick={() => handleDownload('txt')}
                        className={`col-span-1 py-4 font-black rounded-2xl flex flex-col items-center justify-center transition-all 
                            ${isDownloadingTxt ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                        title="Download TXT"
                    >
                        {isDownloadingTxt ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        <span className="text-[8px] mt-1 uppercase font-black">{isDownloadingTxt ? '...' : 'TXT'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TranscriptDrawer;