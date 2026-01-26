"use client";

import React, { useState } from 'react';
import {
    Loader2, Download, Settings, Link as LinkIcon,
    ShieldCheck, AlertCircle, Music, RefreshCcw, X, Sparkles, Check
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context'; // 🚀 引入 AuthContext
import { saveAs as fileSaveAs } from "file-saver";
import SubscriptionModal from "@/components/SubscriptionModal"; // 🚀 引入新组件

// 匹配后端返回的简化数据结构
interface VideoData {
    title: string;
    thumbnail: string;
    duration: number;
    url: string;
    ext: string;
    ua: string;
    filesize: number;
}

export default function Mp3ToolSection() {
    const { user, credits, consumeUsage, isLoggedIn, login } = useAuth(); // 🚀 获取授权状态及方法

    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPayLoading, setIsPayLoading] = useState(false); // 🚀 支付加载状态
    const [isModalOpen, setIsModalOpen] = useState(false); // 订阅弹窗状态
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatDuration = (seconds: number) => {
        if (!seconds) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // 🚀 处理支付跳转逻辑
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
                alert("Payment gateway is busy, please try again.");
            }
        } catch (error) {
            alert("Connection error, please try again.");
        } finally {
            setIsPayLoading(false);
        }
    };

    // 1. 请求后端获取直链 (解析不扣费)
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

    // 2. 核心流式下载逻辑 (带积分校验)
    const handleDownload = async () => {
        if (!videoData || isDownloading) return;

        // --- 🚀 步骤 1: 基础积分预检 ---
        if (credits <= 0) {
            setIsModalOpen(true);
            return;
        }

        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            // --- 🚀 步骤 2: 调用后端扣费接口 ---
            const hasQuota = await consumeUsage('download');
            if (!hasQuota) {
                setIsModalOpen(true);
                setIsDownloading(false);
                return;
            }

            // --- 🚀 步骤 3: 扣费成功，开始下载 ---
            const WORKER_URL = "https://proud-frost-bf8e.franke-4b7.workers.dev/";
            const params = new URLSearchParams({
                url: videoData.url,
                title: videoData.title,
            });

            const response = await fetch(`${WORKER_URL}?${params.toString()}`);
            if (!response.ok) throw new Error("Worker transfer failed");

            const contentLength = response.headers.get('content-length');
            const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
            const reader = response.body?.getReader();
            if (!reader) throw new Error("Stream reader failed");

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

            const audioBlob = new Blob(chunks, { type: 'audio/x-m4a' });
            const safeFileName = `${videoData.title.replace(/[\\/:*?"<>|]/g, '_')}.m4a`;

            const blobUrl = window.URL.createObjectURL(audioBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = safeFileName;
            link.click();
            window.URL.revokeObjectURL(blobUrl);

        } catch (err: any) {
            alert("Download failed: " + err.message);
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    return (
        <section id="tool-interface" className="relative text-center py-20 px-4">

            {/* 🚀 集成通用的订阅弹窗组件 */}
            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpgrade={handleUpgradeClick}
                isLoading={isPayLoading}
            />

            <div className="glow-effect -z-10"></div>

            <h1 className="text-3xl md:text-5xl font-black font-poppins leading-tight tracking-tight text-slate-900 mb-6">
                Free YouTube Shorts M4A Downloader:<br />
                <span className="text-red-600">for High-Quality Audio</span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto mb-10 text-lg">
                Extract high-quality audio tracks from your favorite Shorts in seconds.
            </p>

            {/* 输入区 */}
            <div className="max-w-4xl mx-auto mb-12 text-left">
                <div className="bg-white p-3 rounded-4xl border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
                    <form onSubmit={handleExtract} className="flex flex-col md:flex-row items-stretch gap-3">
                        <div className="relative grow flex bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden focus-within:bg-white transition-all">
                            <div className="relative grow flex items-center h-12 px-4">
                                <LinkIcon size={18} className="text-slate-400 mr-3" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube link here..."
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
                                            console.error('Clipboard access denied');
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
                            className="md:w-52 px-6 py-4 md:py-0 rounded-2xl font-black text-md flex items-center justify-center gap-3 transition-all bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 disabled:opacity-70 active:scale-95"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={22} /> : <RefreshCcw size={20} strokeWidth={3} />}
                            <span>{isLoading ? 'Wait...' : 'Analyze Audio'}</span>
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
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
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                                M4A Audio
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 text-left">
                            <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mb-6 leading-tight tracking-tighter">
                                {videoData.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest leading-none">Format</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                                        <Music size={14} className="text-red-500" /> High Quality
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest leading-none">Size</p>
                                    <p className="text-sm font-bold text-slate-700 uppercase">
                                        {(videoData.filesize / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="relative group w-full h-16 bg-slate-950 hover:bg-red-600 text-white font-black text-lg rounded-2xl transition-all overflow-hidden shadow-xl active:scale-[0.98] disabled:opacity-90"
                                >
                                    {isDownloading && (
                                        <div
                                            className="absolute left-0 top-0 h-full bg-white/10 transition-all duration-300"
                                            style={{ width: `${downloadProgress}%` }}
                                        />
                                    )}

                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isDownloading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                                                <span className="uppercase tracking-widest text-sm italic">Downloading {downloadProgress}%</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="group-hover:translate-y-0.5 transition-transform" size={24} />
                                                <span className="uppercase tracking-tight">Save Audio File</span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setVideoData(null); setUrl(''); }}
                                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-all text-[10px] uppercase tracking-widest"
                                >
                                    <RefreshCcw size={14} /> Analyze Another
                                </button>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                <ShieldCheck size={14} className="text-green-500" />
                                Verified AAC Extraction • 1 Credit Used
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