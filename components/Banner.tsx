"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Banner() {
  const t = useTranslations('banner');

  return (
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
    </div>
  );
}
