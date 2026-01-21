import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ytshortsdl.net'

  // 根据你的项目目录结构提取的所有路径
  const routes = [
    '/', // 首页
    '/about',
    '/addon',
    '/pricing',
    '/privacy',
    '/terms',
    '/no-watermark',
    '/4k-shorts-downloader',
    '/shorts-to-mp3',
    '/shorts-reuse-guide',
    '/shorts-thumbnail-tool',
    '/shorts-creators-reddit-insights',
    // Guide 子目录
    '/guide/chrome-extension',
    '/guide/iphone-downloader',
    '/guide/latest-shorts-tool',
    '/guide/shorts-to-mp3-tutorial',
    '/guide/shorts-without-watermark',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}