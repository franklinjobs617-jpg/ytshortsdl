"use client";

import React, { useState } from 'react';
import { Loader2, Download, Settings, Link as LinkIcon, ShieldCheck, AlertCircle, Music, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

// 匹配后端返回的简化数据结构
interface VideoData {
    title: string;
    thumbnail: string;
    duration: number;
    url: string;      // 已被后端过滤为 Format 18 的直链
    ext: string;      // 后端强制返回的 "m4a"
    ua: string;       // 解析时使用的 UA
    filesize: number; // Format 18 的大小
}

// 文件保存辅助函数
const saveAs = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
};

export default function Mp3ToolSection() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatDuration = (seconds: number) => {
        if (!seconds) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // 1. 请求后端获取直链
    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setVideoData(null);

        try {
            const response = await fetch('https://ytdlp.vistaflyer.com/api/get-audio-parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() })
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || "Failed to analyze link.");
            }

            setVideoData(result);
        } catch (err: any) {
            setError(err.message || "Connection failed");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. 核心流式下载逻辑
    const handleDownload = async () => {
        if (!videoData || isDownloading) return;

        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            const WORKER_URL = "https://proud-frost-bf8e.franke-4b7.workers.dev/";

            const params = new URLSearchParams({
                url: videoData.url,
                title: videoData.title,
            });

            const response = await fetch(`${WORKER_URL}?${params.toString()}&ua=${undefined}`);
            if (!response.ok) throw new Error("Worker transfer failed");

            const contentLength = response.headers.get('content-length');
            const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
            const reader = response.body?.getReader();
            if (!reader) throw new Error("Stream reader initialization failed");

            // --- 修复点：显式声明为 BlobPart[] ---
            const chunks: BlobPart[] = [];
            let loaded = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value);
                    loaded += value.length;
                    if (totalSize) {
                        setDownloadProgress(Math.round((loaded / totalSize) * 100));
                    }
                }
            }

            // 将下载的数据封装为 m4a MIME 类型
            const audioBlob = new Blob(chunks, { type: 'audio/x-m4a' });

            // 强制后缀名为 .m4a
            const safeFileName = `${videoData.title.replace(/[\\/:*?"<>|]/g, '_')}.m4a`;

            saveAs(audioBlob, safeFileName);

        } catch (err: any) {
            alert("Download failed: " + err.message);

        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    return (
        <section id="tool-interface" className="relative text-center py-20 px-4">
            <div className="glow-effect -z-10"></div>

            <h1 className="text-3xl md:text-5xl font-black font-poppins leading-tight tracking-tight text-slate-900 mb-6">
                Free YouTube Shorts M4A Downloader:<br />
                <span className="text-red-600">for High-Quality Audio</span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto mb-10 text-lg">
                Extract high-quality audio tracks from your favorite Shorts in seconds.
            </p>

            {/* 输入区 */}
            <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                    <form onSubmit={handleExtract} className="flex flex-col md:flex-row items-stretch gap-3">
                        <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all">
                            <div className="relative grow flex items-center h-12 px-4">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube link (Shorts or Video)..."
                                    required
                                    className="w-full h-full bg-transparent outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-normal"
                                />

                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            const text = await navigator.clipboard.readText();
                                            setUrl(text);
                                        } catch (err) {
                                            console.error('Failed to read clipboard');
                                        }
                                    }}
                                    className="absolute hidden md:flex right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg transition-all shadow-sm z-10 items-center gap-1.5 uppercase hover:bg-slate-50"
                                >
                                    Paste
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <Settings size={22} strokeWidth={3} />
                            )}
                            <span>{isLoading ? 'Wait...' : 'Analyze Audio'}</span>
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} />
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {/* 下载卡片 */}
            {videoData && (
                <div className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden p-2">
                        <div className="relative group aspect-video rounded-[2rem] overflow-hidden">
                            <img src={videoData.thumbnail} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-black px-3 py-1.5 rounded-full">
                                {formatDuration(videoData.duration)}
                            </div>
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                                M4A Audio
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 text-left">
                            <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mb-6 leading-tight">
                                {videoData.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Format</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                        <Music size={14} className="text-red-500" /> High Quality M4A
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Size</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {(videoData.filesize / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="relative group w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl transition-all overflow-hidden shadow-xl shadow-red-600/20 disabled:opacity-90"
                                >
                                    {isDownloading && (
                                        <div
                                            className="absolute left-0 top-0 h-full bg-red-800/40 transition-all duration-300"
                                            style={{ width: `${downloadProgress}%` }}
                                        />
                                    )}

                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isDownloading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Downloading {downloadProgress}%</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="group-hover:translate-y-0.5 transition-transform" />
                                                <span>Download M4A Audio</span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setVideoData(null); setUrl(''); }}
                                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm"
                                >
                                    <RefreshCcw size={16} /> Convert Another
                                </button>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                                <ShieldCheck size={14} className="text-green-500" />
                                Verified High-Bitrate AAC Extraction
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-12 flex flex-col items-center">
                <span className="text-slate-400 mb-4 font-bold text-sm">Professional Creator Suite</span>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                        <span className="text-2xl">📽️</span>
                        <div className="text-left font-black tracking-tighter"><p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 01</p><p className="text-sm font-black">Download Shorts</p></div>
                    </Link>
                    <Link href="/video-to-script-converter" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                        <span className="text-2xl">🤖</span>
                        <div className="text-left font-black tracking-tighter">
                            <p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 02</p><p className="text-sm font-black">Video to Script</p></div>
                    </Link>
                    <Link href="/ai-script-generator" className="px-6 py-2 bg-white border border-slate-200 rounded-3xl font-black text-slate-700 hover:text-red-600 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
                        <span className="text-2xl">✍️</span>
                        <div className="text-left font-black tracking-tighter"><p className="text-[8px] text-slate-400 uppercase mb-1 tracking-widest font-black">Tool 04</p><p className="text-sm font-black">AI Script Generator</p></div>
                    </Link>
                </div>
            </div>
        </section>
    );
}