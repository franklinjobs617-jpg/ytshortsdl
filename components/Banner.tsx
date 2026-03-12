"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Script from 'next/script';
import AdBanner from './AdBanner';

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
      <div className='w-full flex-row items-center justify-center mx-auto max-w-7xl text-center '>
        <div className=" flex flex-col items-center w-full">
          {/* 桌面端：显示 728x90 大横幅 */}
          <div className="hidden md:block">
            <AdBanner id="fffa357e93366b970334fe20a8f410e0" width={728} height={90} format="iframe" />
          </div>

          {/* 移动端：显示 320x50 小横幅 (保证不撑破页面，不遮挡按钮) */}
          <div className="block md:hidden">
            <AdBanner id="bb1cafc2b48c50800926add813a36e32" width={320} height={50} format="iframe" />
          </div>
        </div>
      </div>
    </div>

  );
}
