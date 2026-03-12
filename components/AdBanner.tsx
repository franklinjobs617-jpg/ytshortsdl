"use client";

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    id: string;
    height: number;
    width: number;
    format: string;
}

export default function AdBanner({ id, height, width, format }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 清理之前的广告
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.type = 'text/javascript';

        // 设置 Adsterra 的全局配置变量
        const atOptions = {
            'key': id,
            'format': format,
            'height': height,
            'width': width,
            'params': {}
        };

        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;

        const adScript = document.createElement('script');
        adScript.type = 'text/javascript';
        adScript.src = `https://drainalmost.com/${id}/invoke.js`;

        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(adScript);
    }, [id, height, width, format]);

    return (
        <div
            className="flex justify-center items-center my-2 overflow-hidden"
            style={{ minHeight: height }}
            ref={containerRef}
        />
    );
}
