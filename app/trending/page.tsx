import { Metadata } from "next";
import TrendingGrid from "@/components/TrendingGrid";

export const metadata: Metadata = {
    title: 'YouTube Trending List | Today\'s Viral Videos & Shorts',
    description: 'Explore daily trending YouTube videos and shorts. Use AI tools for insights.',
};

// 保持 24 小时更新一次缓存
export const revalidate = 86400;

async function getTrendingVideos() {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    try {
        // 抓取 50 条，方便前端做 Shorts 和 视频的分类过滤
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`,
            { next: { revalidate: 86400 } }
        );
        const data = await res.json();
        return data.items || [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

export default async function TrendingPage() {
    const videos = await getTrendingVideos();

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trending Now</h1>
                        <p className="text-sm text-gray-500 mt-1">Discover what&apos;s viral today across YouTube.</p>
                    </div>
                </div>

                {/* 交互式网格组件 */}
                <TrendingGrid initialVideos={videos} />
            </main>
        </div>
    );
}