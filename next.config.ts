import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'media.theresanaiforthat.com',
        port: '',
        pathname: '/**', // 使用通配符匹配所有路径
      },
    ],
  },
  async redirects() {
    return [

      {
        // 匹配多层目录下的 html 文件，例如 /guide/tools/test.html
        // :path+ 匹配一层或多层目录
        // :slug 匹配最后的文件名
        source: '/:path+/:slug.html',
        destination: '/:path+/:slug',
        permanent: true,
      },
      {
        // 匹配根目录下的 html 文件，例如 /about.html
        source: '/:slug.html',
        destination: '/:slug',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);