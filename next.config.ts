import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 建议关闭尾部斜杠，保持 URL 简洁（ytshortsdl.net/about）
  trailingSlash: false, 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }, 
    ],
  },

  async redirects() {
    return [
      {
        // 匹配任意层级的 .html 结尾路径，例如：
        // /about.html -> /about
        // /guide/latest-shorts-tool.html -> /guide/latest-shorts-tool
        source: '/:path*((?!index).+)\\.html',
        destination: '/:path*',
        permanent: true, // 301 永久重定向，传递 SEO 权重
      },
    ];
  },
};

export default nextConfig;