"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Script from 'next/script';

export default function Banner() {
  const t = useTranslations('banner');

  return (
    <div className='w-full'>
      <div className="w-full bg-gradient-to-r from-[#ff3838] to-[#ff9f43] py-2 px-3 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <div className="flex items-center gap-2 text-white">
            <span className="hidden sm:inline-block bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight uppercase">
              {t('aiTool')}
            </span>
            <p className="text-[11px] sm:text-sm font-semibold leading-snug">
              {t('removeWatermark')}
            </p>
          </div>
          <Link href="https://ytvidhub.com/?utm_source=ytshortsdl&utm_content=footer_bar"
            target="_blank"
            className="bg-white text-orange-600 text-[11px] sm:text-[13px] font-black px-4 py-1 rounded-full shadow-md hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap">
            {t('tryFree')}
          </Link>
        </div>
        <div>

        </div>
      </div>
      {/* Adsterra Native Banner - 常驻展现位 (加载即显) */}
      <div className='w-full flex-row items-center justify-center mx-auto max-w-7xl text-center p-4'>
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">
          <p className="text-[10px] text-slate-300 mb-2 font-black tracking-widest text-center uppercase">Recommended for you</p>
          <Script
            id="adsterra-native"
            src="https://drainalmost.com/6a46fda8016a534f3b62de2444535bd0/invoke.js"
            strategy="lazyOnload"
          />
          <div id="container-6a46fda8016a534f3b62de2444535bd0" className="min-h-[100px]"></div>
        </div>
      </div>
    </div>

  );
}
