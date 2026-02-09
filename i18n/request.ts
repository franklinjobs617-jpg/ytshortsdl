import { getRequestConfig } from 'next-intl/server'; 

const  locales=['en', 'hi', 'es'];
const defaultLocale='en'
export { locales, defaultLocale };



export default getRequestConfig(async ({ requestLocale }) => { // 注意这里加了花括号解构参数
  // 显式等待 locale
  const locale = await requestLocale;

  const safeLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default
  };
});