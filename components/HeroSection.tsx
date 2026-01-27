"use client";

import { useState, useEffect, useRef } from "react";
import {
    LoaderCircle, Layers, Link as LinkIcon, Download,
    FileArchive, FileText, AlertCircle, Plus, ClipboardPaste, X, Sparkles, Check
} from 'lucide-react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import TranscriptDrawer from "@/components/TranscriptDrawer";
import SubscriptionModal from "@/components/SubscriptionModal";

const WORKER_URLS = [
    "https://dry-water-d2f3.franke-4b7.workers.dev",
    "https://throbbing-breeze-b608.franke-4b7.workers.dev",
    "https://broken-frost-aa82.franke-4b7.workers.dev",
    "https://fragrant-butterfly-8f1f.franke-4b7.workers.dev"
];

export default function HeroSection() {
    const { user, isLoggedIn, credits, checkQuota, consumeUsage, deductCredit, login } = useAuth();

    const [mode, setMode] = useState<"single" | "batch">("single");
    const [singleInputUrl, setSingleInputUrl] = useState("");
    const [batchInputUrl, setBatchInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [singleResults, setSingleResults] = useState<any[]>([]);
    const [batchResults, setBatchResults] = useState<any[]>([]);
    const [activeDownloads, setActiveDownloads] = useState<Record<number, number>>({});
    const [isZipDownloading, setIsZipDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState("");
    const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPayLoading, setIsPayLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const API_SINGLE = 'https://ytdlp.vistaflyer.com/api/get-parse';
    const API_BATCH = 'https://ytdlp.vistaflyer.com/api/get-parse-batch';

    const currentResults = mode === "single" ? singleResults : batchResults;

    const handleUpgradeClick = async (typeString: string) => {
        if (!isLoggedIn) { login(); return; }
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
            if (data.url) window.location.href = data.url;
            else addToast("Payment gateway error", "error");
        } catch (error) {
            addToast("Connection error", "error");
        } finally {
            setIsPayLoading(false);
        }
    };

    const handleTabChange = (newMode: "single" | "batch") => {
        setMode(newMode);
        if (newMode === "single" && !singleInputUrl && batchInputUrl) {
            const firstLine = batchInputUrl.split('\n').find(line => line.trim() !== "");
            if (firstLine) setSingleInputUrl(firstLine);
        }
    };

    const addToast = (message: string, type: 'success' | 'error' = 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (mode === "single") setSingleInputUrl(text);
            else setBatchInputUrl(text);
            addToast("URL pasted", "success");
        } catch (err) {
            addToast("Paste failed", "error");
        }
    };

    const handleParse = async () => {
        const activeUrl = mode === "single" ? singleInputUrl : batchInputUrl;
        const urls = activeUrl.split('\n').filter(u => u.trim() !== "");
        if (urls.length === 0) { addToast("Please enter a URL", "error"); return; }

        // 🚀 预检本地积分
        if (credits <= 0) { setIsModalOpen(true); return; }

        setIsLoading(true);
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
            addToast("Parsed successfully", "success");
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        } catch (err: any) {
            addToast(err.message, "error");
        } finally {
            setIsLoading(false);
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

    // 🚀 核心：单个视频下载逻辑
    const downloadSingle = async (video: any, index: number) => {
        if (activeDownloads[index] !== undefined || isZipDownloading) return;

        // 1. 🚀 下载前只检查不扣费
        const canI = await checkQuota('download');
        if (!canI) {
            setIsModalOpen(true);
            return;
        }

        setActiveDownloads(prev => ({ ...prev, [index]: 0 }));
        try {
            // 2. 执行真正的网络下载
            const blob = await downloadWithRetry(video, (p) => {
                setActiveDownloads(prev => ({ ...prev, [index]: p }));
            });

            // 3. 🚀 下载流完整到达浏览器后，再执行扣费
            const consumeSuccess = await consumeUsage('download');
            if (consumeSuccess) {
                saveAs(blob, `${video.title.replace(/[\\/:*?"<>|]/g, '_')}.mp4`);
                addToast("Downloaded & 1 Credit used", "success");
            }
        } catch (error: any) {
            addToast(error.message, "error");
        } finally {
            setActiveDownloads(prev => { const n = { ...prev }; delete n[index]; return n; });
        }
    };

    // 🚀 核心：批量下载 ZIP
    const downloadBatchAsZip = async () => {
        // 1. 检查本地积分和下载配额（只查不扣）
        if (credits <= 0) { setIsModalOpen(true); return; }
        const canI = await checkQuota('download');
        if (!canI) { setIsModalOpen(true); return; }

        setIsZipDownloading(true);
        const zip = new JSZip();
        const folder = zip.folder("yt_shorts");
        let successCount = 0;
        try {
            for (let i = 0; i < batchResults.length; i++) {
                const video = batchResults[i];
                if (video.status === 'failed') continue;
                setDownloadProgress(`${i + 1}/${batchResults.length}`);
                try {
                    const blob = await downloadWithRetry(video, () => { });
                    folder?.file(`${video.title.replace(/[\\/:*?"<>|]/g, '_')}.mp4`, blob);
                    successCount++;
                } catch (e) { console.error(e); }
            }

            if (successCount > 0) {
                setDownloadProgress("Packing...");
                const content = await zip.generateAsync({ type: "blob" });

                // 2. 🚀 全部打包成功后，一并扣除 1 次下载配额和 1 个 ZIP 点数
                const consumeSuccess = await consumeUsage('download');
                if (consumeSuccess) {
                    saveAs(content, `batch_${Date.now()}.zip`);
                    await deductCredit();
                    addToast("Batch ZIP success", "success");
                }
            }
        } catch (e: any) {
            addToast("ZIP failed", "error");
        } finally {
            setIsZipDownloading(false);
            setDownloadProgress("");
        }
    };

    const handleOpenTranscript = async (video: any) => {
        // 打开抽屉只预检，不消耗 extract 积分
        const canI = await checkQuota('extract');
        if (!canI) {
            setIsModalOpen(true);
            return;
        }
        setSelectedVideo(video);
        setIsDrawerOpen(true);
    };

    useEffect(() => {
        if (mode === 'batch' && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [batchInputUrl, mode]);

    return (
        <>
            <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpgrade={handleUpgradeClick} isLoading={isPayLoading} />

            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-100 flex flex-col items-center pointer-events-none w-xs md:w-lg px-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-slate-900' : 'bg-green-600'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto mb-3 border border-white/10 w-full`}>
                        <span className={toast.type === 'error' ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{toast.type === 'error' ? '●' : '✓'}</span>
                        <span className="font-bold text-xs">{toast.message}</span>
                    </div>
                ))}
            </div>

            <section className="relative py-12 md:py-24 text-center px-4">
                <div className="glow-effect -z-10"></div>
                <div className="container max-w-6xl mx-auto relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
                        Free YouTube Shorts Downloader : <br /><span className="text-red-600">AI Creator Suite</span>
                    </h1>
                    <p className="mt-4 text-md md:text-lg text-slate-600 font-medium tracking-tight">
                        Download Shorts and use AI to transform videos into viral scripts instantly.
                    </p>



                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 backdrop-blur-sm border border-white shadow-inner">
                            <button onClick={() => handleTabChange("single")} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${mode === 'single' ? 'bg-white shadow-lg text-red-600' : 'text-slate-500 hover:text-slate-800'}`}><LinkIcon size={16} /> Single</button>
                            <button onClick={() => handleTabChange("batch")} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${mode === 'batch' ? 'bg-white shadow-lg text-red-600' : 'text-slate-500 hover:text-slate-800'}`}><Layers size={16} /> Batch (Max 3)</button>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                            <div className="flex flex-col md:flex-row items-stretch gap-3">
                                <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all px-4 items-center min-h-12 text-left">
                                    {mode === 'batch' && <div className="hidden md:flex flex-col py-5 px-3 bg-slate-100/50 text-slate-400 text-xs font-mono border-r border-slate-200 select-none space-y-[0.7rem] mr-4 ml-[-1rem]"><span>01</span><span>02</span><span>03</span></div>}
                                    <div className="grow">
                                        {mode === 'single' ? (
                                            <div className="flex items-center h-12 px-2 text-left font-black"><LinkIcon size={18} className="text-slate-400 mr-3" /><input value={singleInputUrl} onChange={(e) => setSingleInputUrl(e.target.value)} placeholder="Paste YouTube link here..." className="w-full h-full bg-transparent outline-none text-slate-800 font-bold" /></div>
                                        ) : (
                                            <textarea ref={textareaRef} value={batchInputUrl} onChange={(e) => setBatchInputUrl(e.target.value)} rows={3} placeholder="Paste up to 3 links (one per line)..." className="w-full px-4 md:p-5 bg-transparent outline-none text-slate-800 font-mono text-sm leading-relaxed resize-none text-left overflow-hidden" />
                                        )}
                                        <button onClick={handlePaste} className="absolute hidden md:flex right-4 top-1/2 -translate-y-1/2 md:top-2 md:translate-y-0 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg transition-all shadow-sm z-10 items-center gap-1.5 uppercase">Paste</button>
                                    </div>
                                </div>
                                <button onClick={handleParse} disabled={isLoading} className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95">
                                    {isLoading ? <LoaderCircle className="animate-spin" /> : <Download size={22} strokeWidth={3} />}<span>{isLoading ? 'Wait...' : 'Parse Video'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {currentResults.length > 0 && (
                        <div ref={resultsRef} className="mt-8 text-left animate-in fade-in slide-in-from-bottom-10 duration-700 scroll-mt-24">
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-slate-200 pb-8 gap-6">
                                <div className="w-full flex items-center gap-5">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white text-xl font-black shadow-lg">{currentResults.length}</span>
                                    <div>
                                        <div className="md:flex md:items-center gap-3 text-left">
                                            <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tighter uppercase italic">Ready to download</h3>
                                            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1.5 px-4 py-1.5 my-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-black tracking-tighter transition-all active:scale-95"><Plus size={14} strokeWidth={4} /> Parse Another</button>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest text-[10px]">Parsed via our high-speed node</p>
                                    </div>
                                </div>
                                {mode === "batch" && batchResults.length > 1 && (
                                    <button onClick={downloadBatchAsZip} disabled={isZipDownloading || Object.keys(activeDownloads).length > 0} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-2xl disabled:bg-slate-300">
                                        {isZipDownloading ? <LoaderCircle className="animate-spin" /> : <FileArchive size={18} />}<span>{isZipDownloading ? downloadProgress : 'Download ZIP'}</span>
                                    </button>
                                )}
                            </div>

                            <div className={currentResults.length === 1 ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
                                {currentResults.map((video, idx) => {
                                    const progress = activeDownloads[idx];
                                    const isItemLoading = progress !== undefined;
                                    return (
                                        <div key={idx} className={`group bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col ${currentResults.length === 1 ? 'w-full max-w-md' : 'w-full'}`}>
                                            <div className="relative aspect-video overflow-hidden">
                                                {video.status !== 'failed' ? (
                                                    <><img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" /><div className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-tighter font-black font-black">HD Ready</div></>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500 p-8 font-black text-[10px] italic"><AlertCircle size={32} className="mb-2" /> FAILED</div>
                                                )}
                                            </div>
                                            <div className="px-8 py-6 grow flex flex-col text-left">
                                                <p className="text-sm font-bold text-slate-800 line-clamp-2 h-10 mb-4 leading-relaxed group-hover:text-red-600 transition-colors font-bold">{video.title || "Untitled Video"}</p>
                                                {video.status !== 'failed' && (
                                                    <div className="flex gap-2 mt-auto w-full">
                                                        <button onClick={() => downloadSingle(video, idx)} disabled={isItemLoading || isZipDownloading} className={`flex-2 py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg font-black ${isItemLoading ? 'bg-slate-400 text-white shadow-none' : 'bg-slate-900 hover:bg-red-600 text-white shadow-red-200'}`}>
                                                            {isItemLoading ? <div className="relative flex items-center justify-center"><LoaderCircle size={28} className="animate-spin opacity-40" /><span className="absolute text-[12px] font-bold">{progress}%</span></div> : <Download size={20} strokeWidth={3} />}
                                                            <span>{isItemLoading ? 'Downloading...' : 'Download Video'}</span>
                                                        </button>
                                                        {
                                                            video.languages && <button onClick={() => handleOpenTranscript(video)} disabled={isItemLoading || isZipDownloading} className="flex-1 relative py-4 rounded-2xl flex items-center justify-center gap-1 transition-all border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 font-black tracking-tighter leading-none"><FileText size={14} className="shrink-0" />Transcript<span className="text-[8px] absolute right-2 top-0 bg-red-500 text-white px-2 py-0.5 rounded-md font-black shadow-sm">AI</span></button>
                                                        }

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-12 flex flex-col items-center">
                    <span className="text-slate-400 mb-8 uppercase font-black tracking-[0.4em] text-[10px]">Professional Creator Suite</span>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/shorts-to-mp3" className="px-10 py-4 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:shadow-2xl transition-all flex items-center gap-4 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🎵</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[10px] text-slate-400 uppercase mb-1 tracking-widest font-black text-[8px]">Tool 01</p><p className="text-sm font-black">Extract MP3</p></div>
                        </Link>
                        <Link href="/video-to-script-converter" className="px-10 py-4 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:shadow-2xl transition-all flex items-center gap-4 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[10px] text-slate-400 uppercase mb-1 tracking-widest font-black text-[8px]">Tool 02</p><p className="text-sm font-black">Video to Script</p></div>
                        </Link>
                        <Link href="/ai-script-generator" className="px-10 py-4 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:shadow-2xl transition-all flex items-center gap-4 group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">✍️</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[10px] text-slate-400 uppercase mb-1 tracking-widest font-black text-[8px]">Tool 03</p><p className="text-sm font-black">AI Script Generator</p></div>
                        </Link>
                    </div>
                </div>
            </section>

            <TranscriptDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} video={selectedVideo} addToast={addToast} />
        </>
    );
}