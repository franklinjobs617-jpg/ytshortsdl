"use client";

import { useState, useEffect, useRef } from "react";
import {
    LoaderCircle, Layers, Link as LinkIcon, Download,
    FileArchive, FileText, AlertCircle, X, Sparkles, Check, Plus
} from 'lucide-react';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import TranscriptDrawer from "@/components/TranscriptDrawer";

export default function HeroSection() {
    const [mode, setMode] = useState<"single" | "batch">("single");

    // --- 逻辑：分离输入框状态，防止切换 Tab 丢失数据 ---
    const [singleInputUrl, setSingleInputUrl] = useState("");
    const [batchInputUrl, setBatchInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // --- 逻辑：分离结果区状态，实现 Tab 联动 ---
    const [singleResults, setSingleResults] = useState<any[]>([]);
    const [batchResults, setBatchResults] = useState<any[]>([]);

    // 独立的下载状态管理
    const [activeDownloads, setActiveDownloads] = useState<Record<number, number>>({});
    const [isZipDownloading, setIsZipDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState("");
    const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

    // 弹窗与抽屉控制
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    const { credits, deductCredit } = useAuth();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const API_SINGLE = 'https://ytdlp.vistaflyer.com/api/get-parse';
    const API_BATCH = 'https://ytdlp.vistaflyer.com/api/get-parse-batch';
    const WORKER_URL = 'https://dry-water-d2f3.franke-4b7.workers.dev';

    // 根据当前模式决定显示哪份数据
    const currentResults = mode === "single" ? singleResults : batchResults;

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
            addToast("URL pasted from clipboard", "success");
        } catch (err) {
            addToast("Clipboard access denied.", "error");
        }
    };

    const handleParse = async () => {
        const activeUrl = mode === "single" ? singleInputUrl : batchInputUrl;
        const urls = activeUrl.split('\n').filter(u => u.trim() !== "");

        if (urls.length === 0) {
            addToast("Please enter at least one valid URL.", "error");
            return;
        }

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
            addToast(err.message || "Failed to parse video.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadSingle = async (video: any, index: number) => {
        if (activeDownloads[index] !== undefined || isZipDownloading) return;
        setActiveDownloads(prev => ({ ...prev, [index]: 0 }));
        try {
            console.log(video);
            const url = `${WORKER_URL}?title=${encodeURIComponent(video.title)}&url=${encodeURIComponent(video.url)}&ua=${encodeURIComponent(video.ua)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Download Link Error");
            const contentLength = response.headers.get('content-length');
            const reader = response.body?.getReader();
            if (!reader) throw new Error("Stream Error");
            const chunks = [];
            let loaded = 0;
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                loaded += value.length;
                if (total) setActiveDownloads(prev => ({ ...prev, [index]: Math.round((loaded / total) * 100) }));
            }
            saveAs(new Blob(chunks), `${video.title.replace(/[\\/:*?"<>|]/g, '_')}.mp4`);
            addToast("Download started", "success");
        } catch (error: any) {
            addToast(error.message, "error");
        } finally {
            setActiveDownloads(prev => { const n = { ...prev }; delete n[index]; return n; });
        }
    };

    const downloadBatchAsZip = async () => {
        if (credits <= 0) {
            setIsModalOpen(true);
            return;
        }
        setIsZipDownloading(true);
        const zip = new JSZip();
        const folder = zip.folder("yt_shorts");
        let successCount = 0;
        try {
            for (let i = 0; i < batchResults.length; i++) {
                const video = batchResults[i];
                if (video.status === 'failed') continue;
                setDownloadProgress(`${i + 1}/${batchResults.length}`);
                const res = await fetch(`${WORKER_URL}?title=${encodeURIComponent(video.title)}&url=${encodeURIComponent(video.url)}`);
                if (res.ok) {
                    folder?.file(`${video.title.replace(/[\\/:*?"<>|]/g, '_')}.mp4`, await res.blob());
                    successCount++;
                }
            }
            if (successCount > 0) {
                setDownloadProgress("Packing...");
                saveAs(await zip.generateAsync({ type: "blob" }), `batch_${Date.now()}.zip`);
                await deductCredit();
                addToast("Batch ZIP created & 1 Credit used", "success");
            }
        } catch (e: any) {
            addToast("ZIP creation failed", "error");
        } finally {
            setIsZipDownloading(false);
            setDownloadProgress("");
        }
    };

    // 自动调整文本框高度
    useEffect(() => {
        if (mode === 'batch' && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [batchInputUrl, mode]);

    return (
        <>
            {/* --- 订阅弹窗 Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] max-w-md w-full p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
                        <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mb-6 text-red-600"><Sparkles size={32} /></div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Out of Credits</h2>
                        <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">Upgrade to Pro to unlock unlimited batch downloads and AI tools.</p>
                        <div className="space-y-3 mb-8">
                            {[{ name: "Weekly Pack", price: "$4.99", desc: "50 Credits / Week" }, { name: "Creator Pro", price: "$12.99", desc: "Unlimited Downloads" }].map((p, i) => (
                                <div key={i} className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${i === 1 ? 'border-red-500 bg-red-50/50' : 'border-slate-100 bg-slate-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i === 1 ? 'bg-red-500 text-white' : 'bg-slate-200'}`}><Check size={12} strokeWidth={4} /></div>
                                        <div><p className="font-black text-slate-900 text-sm">{p.name}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{p.desc}</p></div>
                                    </div>
                                    <span className="text-lg font-black text-slate-900">{p.price}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-red-600 transition-all active:scale-[0.98]">Upgrade My Account</button>
                    </div>
                </div>
            )}

            {/* --- Toast 区域 --- */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-100 flex flex-col items-center pointer-events-none w-xs md:w-lg max-sm px-4">
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
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                        Free YouTube Shorts Downloader : <br /><span className="text-red-600">AI Creator Suite</span>
                    </h1>
                    <p className="mt-4 text-md md:text-lg text-slate-600 font-medium tracking-tight">
                        Download Shorts and use AI to transform videos into viral scripts instantly.
                    </p>

                    <div className="flex justify-center mt-10 mb-8">
                        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 backdrop-blur-sm border border-white shadow-inner">
                            <button onClick={() => handleTabChange("single")} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${mode === 'single' ? 'bg-white shadow-lg text-red-600' : 'text-slate-500 hover:text-slate-800'}`}><LinkIcon size={16} /> Single</button>
                            <button onClick={() => handleTabChange("batch")} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${mode === 'batch' ? 'bg-white shadow-lg text-red-600' : 'text-slate-500 hover:text-slate-800'}`}><Layers size={16} /> Batch (Max 3)</button>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                            <div className="flex flex-col md:flex-row items-stretch gap-3">
                                <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all">
                                    {mode === 'batch' && <div className="hidden md:flex flex-col py-5 px-3 bg-slate-100/50 text-slate-400 text-xs font-mono border-r border-slate-200 select-none space-y-[0.7rem]"><span>01</span><span>02</span><span>03</span></div>}
                                    <div className="relative grow">
                                        {mode === 'single' ? (
                                            <div className="flex items-center h-12 px-4">
                                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                                <input value={singleInputUrl} onChange={(e) => setSingleInputUrl(e.target.value)} placeholder="Paste YouTube link here..." className="w-full h-full bg-transparent outline-none text-slate-800 font-bold" />
                                            </div>
                                        ) : (
                                            <textarea ref={textareaRef} value={batchInputUrl} onChange={(e) => setBatchInputUrl(e.target.value)} rows={3} placeholder="Paste up to 3 links (one per line)..." className="w-full px-4 md:p-5 bg-transparent outline-none text-slate-800 font-mono text-sm leading-relaxed resize-none text-left overflow-hidden" />
                                        )}
                                        <button onClick={handlePaste} className="absolute hidden md:flex right-4 top-1/2 -translate-y-1/2 md:top-2 md:translate-y-0 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg transition-all shadow-sm z-10 items-center gap-1.5 uppercase">Paste</button>
                                    </div>
                                </div>
                                <button onClick={handleParse} disabled={isLoading} className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200">
                                    {isLoading ? <LoaderCircle className="animate-spin" /> : <Download size={22} strokeWidth={3} />}<span>{isLoading ? 'Wait...' : 'Parse Video'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {currentResults.length > 0 && (
                        <div ref={resultsRef} className="mt-8 text-left animate-in fade-in slide-in-from-bottom-10 duration-700 scroll-mt-24">
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-slate-200 pb-8 gap-6">
                                <div className="w-full flex items-center gap-5">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white text-xl font-black shadow-lg shadow-red-200 tracking-tighter">
                                        {currentResults.length}
                                    </span>
                                    <div>
                                        <div className="md:flex md:items-center gap-3">
                                            <h3 className="text-2xl font-black text-slate-900 leading-none">Ready to Download</h3>

                                            <button
                                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                className="flex items-center gap-1.5 px-4 py-1.5 my-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-black tracking-tighter transition-all active:scale-95"
                                            >
                                                <Plus size={14} strokeWidth={4} />
                                                Parse Another
                                            </button>
                                        </div>

                                        <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest text-[10px]">
                                            Parsed via our high-speed node
                                        </p>
                                    </div>
                                </div>

                                {mode === "batch" && batchResults.length > 1 && (
                                    <button
                                        onClick={downloadBatchAsZip}
                                        disabled={isZipDownloading || Object.keys(activeDownloads).length > 0}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-2xl disabled:bg-slate-300"
                                    >
                                        {isZipDownloading ? <LoaderCircle className="animate-spin" /> : <FileArchive size={18} />}
                                        <span>{isZipDownloading ? 'Packing' : 'Download ZIP'}</span>
                                    </button>
                                )}
                            </div>

                            <div className={currentResults.length === 1 ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
                                {currentResults.map((video, idx) => {
                                    const progress = activeDownloads[idx];
                                    const isThisItemDownloading = progress !== undefined;
                                    return (
                                        <div key={idx} className={`group bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col ${currentResults.length === 1 ? 'w-full max-w-md' : 'w-full'}`}>
                                            <div className="relative aspect-video overflow-hidden">
                                                {video.status !== 'failed' ? (
                                                    <><img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" /><div className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase">Ready</div></>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500 p-8 font-black text-[10px] italic"><AlertCircle size={32} className="mb-2" /> FAILED</div>
                                                )}
                                            </div>
                                            <div className="px-8 py-6 grow flex flex-col text-left">
                                                <p className="text-sm font-bold text-slate-800 line-clamp-2 h-10 mb-4 leading-relaxed group-hover:text-red-600 transition-colors">{video.title || "Untitled Video"}</p>
                                                {video.status !== 'failed' && (
                                                    <div className="flex gap-2 mt-auto w-full">
                                                        <button onClick={() => downloadSingle(video, idx)} disabled={isThisItemDownloading || isZipDownloading} className={`flex-2 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 tracking-tighter whitespace-nowrap font-black ${isThisItemDownloading ? 'bg-slate-400 text-white shadow-none' : (isZipDownloading ? 'bg-slate-100 text-slate-300 shadow-none' : 'bg-slate-900 hover:bg-red-600 text-white shadow-red-200')}`}>
                                                            {isThisItemDownloading ? <div className="relative flex items-center justify-center"><LoaderCircle size={28} className="animate-spin opacity-40" /><span className="absolute text-[14px] font-bold">{progress}%</span></div> : <Download size={20} strokeWidth={3} />}
                                                            <span>{isThisItemDownloading ? 'Downloading...' : 'Download Video'}</span>
                                                        </button>
                                                        <button onClick={() => { setSelectedVideo(video); setIsDrawerOpen(true); }} disabled={isThisItemDownloading || isZipDownloading} className="flex-1 relative py-4 rounded-2xl flex items-center justify-center gap-1 transition-all border border-slate-200 group/btn bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50"><FileText size={14} className="group-hover/btn:text-red-500 transition-colors shrink-0" /><span className="text-[11px] font-black tracking-tighter whitespace-nowrap">Transcript</span><span className="text-[8px] absolute right-2 top-0 bg-red-500 text-white px-2 py-0.5 rounded-md font-black shrink-0">AI</span></button>
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
                    <span className="text-slate-400 mb-4 font-bold text-sm">Professional Creator Suite</span>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/shorts-to-mp3" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">🎵</span>
                            <div className="text-left font-black tracking-tighter">
                                <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 01</p>
                                <p className="text-sm font-black">Extract MP3</p></div>
                        </Link>
                        <Link href="/video-to-script-converter" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">🤖</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 02</p><p className="text-sm font-black">Video to Script</p></div>
                        </Link>
                        <Link href="/ai-script-generator" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                            <span className="text-2xl">✍️</span>
                            <div className="text-left font-black tracking-tighter"><p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 03</p><p className="text-sm font-black">AI Script Generator</p></div>
                        </Link>


                    </div>

                </div>
            </section>

            <TranscriptDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} video={selectedVideo} addToast={addToast} />
        </>
    );
}