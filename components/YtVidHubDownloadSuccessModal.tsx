"use client";

import { useEffect } from "react";
import { Captions, ExternalLink, X } from "lucide-react";
import { trackEvent, GA_EVENTS } from "@/lib/gtag";
import { getYtVidHubUrl, writePromoState, dismissDownloadSuccessPromo } from "@/lib/ytvidhub-promo";

const PROMO_URL = getYtVidHubUrl("download_success_modal");

interface YtVidHubDownloadSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function YtVidHubDownloadSuccessModal({ isOpen, onClose }: YtVidHubDownloadSuccessModalProps) {
    useEffect(() => {
        if (isOpen) {
            trackEvent(GA_EVENTS.YTVIDHUB_PROMO_VIEW, { placement: "download_success_modal" });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const close = () => {
        dismissDownloadSuccessPromo();
        trackEvent(GA_EVENTS.YTVIDHUB_PROMO_DISMISS, { placement: "download_success_modal" });
        onClose();
    };

    const handleVisit = () => {
        writePromoState({ clicked: true });
        trackEvent(GA_EVENTS.YTVIDHUB_PROMO_CLICK, { placement: "download_success_modal", target: PROMO_URL });
        onClose();
    };

    return (
        <div className="fixed inset-x-4 bottom-4 z-[850] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end">
            <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.22)] animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={close}
                    aria-label="Close YTVidHub promotion"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-950"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>

                <div className="flex items-start gap-3 p-5 pr-10">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                        <Captions size={22} strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wide text-sky-600">Also need the subtitles?</p>
                        <h3 className="mt-0.5 text-sm font-black leading-snug text-slate-900">
                            Grab SRT / VTT / TXT captions with YTVidHub — free daily credits.
                        </h3>
                    </div>
                </div>

                <div className="flex gap-2 px-5 pb-5">
                    <a
                        href={PROMO_URL}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleVisit}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition-all hover:bg-sky-600"
                    >
                        Get Subtitles Free
                        <ExternalLink size={13} strokeWidth={2.7} />
                    </a>
                    <button
                        onClick={close}
                        className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}
