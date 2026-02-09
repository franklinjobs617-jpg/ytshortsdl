// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 必须与你的 middleware 保持一致
  locales: ['en', 'hi', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' 
});

// 导出生成的导航组件
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);