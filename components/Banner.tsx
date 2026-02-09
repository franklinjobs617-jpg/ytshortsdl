"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Banner() {
  const t = useTranslations('banner');

  return (
    <div className="w-full bg-gradient-to-r from-[#ff0000af] to-[#ff73004b] py-2.5 px-4 shadow-md font-sans min-h-11">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-3 text-white">
          <span className="bg-white/20 text-xs font-medium px-2 py-1 rounded">
            {t('aiTool')}
          </span>
          <p className="text-sm font-medium">
            {t('removeWatermark')}
          </p>
        </div>
        <Link href="https://ytvidhub.com/?utm_source=ytshortsdl&utm_content=footer_bar"
          target="_blank"
          className="bg-white text-[#007bff] text-[13px] font-bold px-4 py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
          {t('tryFree')}
        </Link>
      </div>
    </div>
  );
}
