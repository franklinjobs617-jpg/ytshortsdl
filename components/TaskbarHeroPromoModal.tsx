"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Gamepad2, Shield, Swords, Trophy, X } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

const PROMO_URL = "https://taskbarhero.nanobananas.me";
const STORAGE_KEY = "taskbarhero_promo_v1";
const DISMISS_DAYS = 14;

type StoredPromoState = {
    clicked?: boolean;
    dismissedUntil?: number;
};

function readStoredState(): StoredPromoState {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function writeStoredState(state: StoredPromoState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function TaskbarHeroPromoModal({ isBlocked = false }: { isBlocked?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isBlocked || isOpen) return;

        const stored = readStoredState();
        if (stored.clicked || (stored.dismissedUntil && stored.dismissedUntil > Date.now())) return;

        const timer = window.setTimeout(() => {
            setIsOpen(true);
            trackEvent("taskbarhero_promo_view", { placement: "home_entry_modal" });
        }, 1800);

        return () => window.clearTimeout(timer);
    }, [isBlocked, isOpen]);

    const close = () => {
        writeStoredState({
            ...readStoredState(),
            dismissedUntil: Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000,
        });
        trackEvent("taskbarhero_promo_dismiss", { placement: "home_entry_modal" });
        setIsOpen(false);
    };

    const handleVisit = () => {
        writeStoredState({ ...readStoredState(), clicked: true });
        trackEvent("taskbarhero_promo_click", { placement: "home_entry_modal", target: PROMO_URL });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[900] flex items-center justify-center px-4 py-6 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200" onClick={close} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.26)] animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={close}
                    aria-label="Close Taskbar Hero guide promotion"
                    className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-950"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-[220px] overflow-hidden bg-[#111318] p-6 text-white">
                        <div className="absolute inset-x-0 bottom-0 h-16 border-t border-white/10 bg-[#07080b]" />
                        <div className="absolute left-6 right-6 bottom-5 flex items-center gap-2">
                            {["#ef4444", "#f59e0b", "#22c55e", "#38bdf8"].map((color) => (
                                <span key={color} className="h-5 w-5 rounded-[6px] border border-white/15" style={{ backgroundColor: color }} />
                            ))}
                            <div className="ml-auto flex h-7 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-[10px] font-black text-white/75">
                                <Gamepad2 size={13} />
                                TBH
                            </div>
                        </div>

                        <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Guide HUD</span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] border border-emerald-300/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_35px_rgba(34,197,94,0.18)]">
                                    <Swords size={30} strokeWidth={2.6} />
                                </div>
                                <div className="min-w-0 grow">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <span className="text-sm font-black">Taskbar Hero</span>
                                        <span className="rounded-md bg-emerald-400 px-2 py-0.5 text-[10px] font-black text-slate-950">NEW</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/10">
                                        <div className="h-full w-[72%] rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-black text-white/75">
                                        <div className="rounded-lg bg-white/8 py-2">Heroes</div>
                                        <div className="rounded-lg bg-white/8 py-2">Gear</div>
                                        <div className="rounded-lg bg-white/8 py-2">Builds</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-7 sm:p-8">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                            <Trophy size={13} fill="currentColor" />
                            New game guide
                        </div>

                        <h2 className="text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl">
                            Taskbar Hero Guide
                        </h2>

                        <p className="mt-3 max-w-sm text-sm font-bold leading-6 text-slate-600">
                            Heroes, gear, builds, and progression in one clean place.
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                            {[
                                { label: "Heroes", icon: Shield },
                                { label: "Gear", icon: Swords },
                                { label: "Builds", icon: Trophy },
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
                                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl shadow-slate-300 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
                            >
                                Visit the Guide
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
