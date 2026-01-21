"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Copy, Sparkles, Play, User, Clock, ChevronLeft, ExternalLink } from 'lucide-react';
function formatYouTubeDuration(duration: string) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "00:00";
    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");

    const parts = [
        hours > 0 ? String(hours).padStart(2, '0') : null,
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ].filter(Boolean);

    return parts.join(':');
}
// --- 单个视频卡片组件 ---
const TrendingItem = ({ video }: { video: any }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

    return (
        <div className="flex flex-col group h-full">
            {/* 媒体区域容器 */}
            <div
                className={`relative overflow-hidden rounded-2xl bg-black shadow-sm transition-all duration-300  aspect-video }`}
            >
                {!isPlaying ? (
                    <>
                        <img
                            src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url}
                            alt={video.snippet.title}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* 悬浮操作层 */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-red-600 hover:border-red-600 transition-all"
                            >
                                <Play size={28} fill="currentColor" />
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.open(`/shorts-creators-reddit-insights?v=${video.id}`, '_blank')}
                                    className="bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700"
                                    title="AI Summary"
                                >
                                    <Sparkles size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.snippet.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}

                {/* 左下角数据标签 */}
                <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                        <Play size={10} fill="white" />
                        {Intl.NumberFormat('en-US', { notation: 'compact' }).format(video.statistics.viewCount)}
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold w-fit">
                        <Clock size={10} />
                        {formatYouTubeDuration(video.contentDetails.duration)}
                    </div>
                </div>
            </div>

            {/* 信息区域 */}
            <div className="mt-3 flex flex-col flex-grow px-1">
                <h3 className="text-[14px] font-bold text-gray-900 line-clamp-2 leading-snug h-10 mb-2">
                    {video.snippet.title}
                </h3>

                <div className="flex flex-col gap-1.5 mt-auto">
                    {/* 作者信息 */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <div className="p-1 bg-gray-100 rounded-full">
                            <User size={12} />
                        </div>
                        <span className="text-xs font-medium truncate">{video.snippet.channelTitle}</span>
                    </div>

                    {/* 底部功能栏 */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                        <Link
                            href="/"
                            className="text-[11px] font-bold text-red-600 flex items-center gap-1 hover:underline"
                        >
                            <ChevronLeft size={14} />
                            Download
                        </Link>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(videoUrl);
                                alert("Link copied!");
                            }}
                            className="text-gray-400 hover:text-blue-600 p-1"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 主网格组件 ---
export default function TrendingGrid({ initialVideos }: { initialVideos: any[] }) {
    const [activeTab, setActiveTab] = useState<'all' | 'shorts' | 'video'>('all');

    const processedVideos = useMemo(() => {
        return initialVideos.map(video => {
            const duration = video.contentDetails?.duration || "";
            // 修改 Shorts 判定逻辑：时间少于 61秒 且 标题/描述可能含有 shorts 标签的更准确
            const isShort = duration.includes('S') && !duration.includes('M') && !duration.includes('H');
            return { ...video, isShort };
        });
    }, [initialVideos]);

    const filteredVideos = processedVideos.filter(v => {
        if (activeTab === 'shorts') return v.isShort;
        if (activeTab === 'video') return !v.isShort;
        return true;
    });

    return (
        <div className="w-full">
            {/* 顶部控制栏 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(['all', 'shorts', 'video'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab === 'all' ? "🔥 All Trends" : tab === 'shorts' ? "⚡ Shorts" : "🎥 Videos"}
                        </button>
                    ))}
                </div>
            </div>

            {/* 网格布局：使用 items-start 解决错位 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-12 items-start">
                {filteredVideos.map((video) => (
                    <TrendingItem key={video.id} video={video} />
                ))}
            </div>

            {filteredVideos.length === 0 && (
                <div className="py-20 text-center text-gray-400 font-medium">
                    No content found. Please try again later.
                </div>
            )}
        </div>
    );
}