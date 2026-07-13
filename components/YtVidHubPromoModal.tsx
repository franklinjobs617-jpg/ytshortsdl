"use client";

import { useEffect, useState } from "react";
import { Captions, ExternalLink, FileText, Sparkles, X, Zap } from "lucide-react";
import { trackEvent, GA_EVENTS } from "@/lib/gtag";
import { getYtVidHubUrl, readPromoState, writePromoState } from "@/lib/ytvidhub-promo";

const PROMO_URL = getYtVidHubUrl("entry_modal");
const DISMISS_DAYS = 14;
const OPEN_DELAY_MS = 1800;

export default function YtVidHubPromoModal({ isBlocked = false }: { isBlocked?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isBlocked || isOpen) return;

        const stored = readPromoState();
        if (stored.clicked || (stored.entryDismissedUntil && stored.entryDismissedUntil > Date.now())) return;

        const timer = window.setTimeout(() => {
            setIsOpen(true);
            trackEvent(GA_EVENTS.YTVIDHUB_PROMO_VIEW, { placement: "entry_modal" });
        }, OPEN_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [isBlocked, isOpen]);

    const close = () => {
        writePromoState({ entryDismissedUntil: Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000 });
        trackEvent(GA_EVENTS.YTVIDHUB_PROMO_DISMISS, { placement: "entry_modal" });
        setIsOpen(false);
    };

    const handleVisit = () => {
        writePromoState({ clicked: true });
        trackEvent(GA_EVENTS.YTVIDHUB_PROMO_CLICK, { placement: "entry_modal", target: PROMO_URL });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[900] flex items-center justify-center px-4 py-6 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200" onClick={close} />

            <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto overscroll-contain rounded-[28px] border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.26)] animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={close}
                    aria-label="Close YTVidHub promotion"
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-950"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-[160px] overflow-hidden bg-[#0b1220] p-6 text-white sm:min-h-[220px]">
                        <div className="absolute inset-x-0 bottom-0 h-16 border-t border-white/10 bg-[#05070c]" />
                        <div className="absolute left-6 right-6 bottom-5 flex items-center gap-2">
                            {["#38bdf8", "#818cf8", "#f472b6", "#facc15"].map((color) => (
                                <span key={color} className="h-5 w-5 rounded-[6px] border border-white/15" style={{ backgroundColor: color }} />
                            ))}
                            <div className="ml-auto flex h-7 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-[10px] font-black text-white/75">
                                <Captions size={13} />
                                SRT
                            </div>
                        </div>

                        <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                                </div>
                                <span className="hidden text-[10px] font-black uppercase tracking-[0.18em] text-white/45 sm:inline">Subtitle Export</span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] border border-sky-300/25 bg-sky-400/10 text-sky-300 shadow-[0_0_35px_rgba(56,189,248,0.18)]">
                                    <Captions size={30} strokeWidth={2.6} />
                                </div>
                                <div className="min-w-0 grow">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <span className="text-sm font-black">YTVidHub</span>
                                        <span className="rounded-md bg-sky-400 px-2 py-0.5 text-[10px] font-black text-slate-950">FREE</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/10">
                                        <div className="h-full w-[85%] rounded-full bg-sky-400" />
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-black text-white/75">
                                        <div className="rounded-lg bg-white/8 py-2">SRT</div>
                                        <div className="rounded-lg bg-white/8 py-2">VTT</div>
                                        <div className="rounded-lg bg-white/8 py-2">TXT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-7 sm:p-8">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
                            <Sparkles size={13} fill="currentColor" />
                            Free AI Tool
                        </div>

                        <h2 className="text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl">
                            Need the Subtitles Too?
                        </h2>

                        <p className="mt-3 max-w-sm text-sm font-bold leading-6 text-slate-600">
                            YTVidHub pulls SRT / VTT / TXT captions and AI summaries from any YouTube video, playlist, or channel — free daily credits included.
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                            {[
                                { label: "Bulk Export", icon: FileText },
                                { label: "AI Summary", icon: Sparkles },
                                { label: "Fast & Free", icon: Zap },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                                    <item.icon className="mx-auto mb-1.5 h-4 w-4 text-slate-700" strokeWidth={2.5} />
                                    <span className="block text-[11px] font-black text-slate-700">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={PROMO_URL}
                                target="_blank"
                                rel="noreferrer"
                                onClick={handleVisit}
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-300 transition-all hover:-translate-y-0.5 hover:bg-sky-600 sm:flex-1"
                            >
                                Try YTVidHub Free
                                <ExternalLink size={16} strokeWidth={2.7} />
                            </a>
                            <button
                                onClick={close}
                                className="h-12 rounded-2xl border border-slate-200 px-5 text-sm font-black text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
