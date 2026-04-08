"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, RefreshCcw, ShieldCheck } from "lucide-react";

export default function StripeStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [attempts, setAttempts] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const MAX_ATTEMPTS = 15;
    const progress = useMemo(() => Math.min(100, Math.round((attempts / MAX_ATTEMPTS) * 100)), [attempts]);

    const checkPayment = useCallback(async () => {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            setStatus("error");
            setErrorMsg("Missing Stripe session_id.");
            return "FAILURE";
        }

        try {
            const response = await fetch(`/api/pay/stripe-check-status?sessionId=${encodeURIComponent(sessionId)}`, {
                method: "GET",
                cache: "no-store"
            });
            const data = await response.json();

            if (response.ok && data?.paid) {
                setStatus("success");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
                return "SUCCESS";
            }

            return "PENDING";
        } catch (error) {
            console.error("Stripe verification error:", error);
            return "ERROR";
        }
    }, [router, searchParams]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const poll = async () => {
            if (status === "success" || attempts >= MAX_ATTEMPTS) return;

            const result = await checkPayment();
            if (result !== "SUCCESS") {
                setAttempts((prev) => prev + 1);
                timer = setTimeout(poll, 2000);
            }
        };

        poll();
        return () => clearTimeout(timer);
    }, [attempts, status, checkPayment]);

    useEffect(() => {
        if (attempts >= MAX_ATTEMPTS && status === "loading") {
            setStatus("error");
            setErrorMsg("Payment is still syncing. Please retry in a moment.");
        }
    }, [attempts, status]);

    const handleManualCheck = async () => {
        setIsChecking(true);
        setErrorMsg("");
        const result = await checkPayment();
        if (result !== "SUCCESS") {
            setErrorMsg("Still not synced yet. If charged, please retry shortly.");
        }
        setIsChecking(false);
    };

    return (
        <div className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
            <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />
            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-indigo-200/25 blur-3xl" />

            <div className="relative w-full max-w-lg rounded-[32px] border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_20px_80px_-20px_rgba(15,23,42,0.35)] p-8 md:p-10 text-center">
                <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Secure Payment Verification
                </div>

                {status === "loading" && (
                    <div className="space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                            <Loader2 className="w-24 h-24 animate-spin text-red-600" strokeWidth={2.5} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs font-black text-slate-700">{progress}%</span>
                                <span className="text-[10px] font-bold text-slate-400">{attempts}/{MAX_ATTEMPTS}</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Verifying Stripe Payment</h2>
                        <p className="text-sm leading-relaxed text-slate-500">
                            We are confirming your transaction and syncing account access.
                        </p>
                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
                                style={{ width: `${Math.max(progress, 8)}%` }}
                            />
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 animate-in zoom-in-90">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-200/70">
                            <CheckCircle2 size={52} strokeWidth={2.8} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Payment Confirmed</h2>
                        <p className="text-sm text-slate-500">Everything looks good. Redirecting you now...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-lg shadow-amber-200/70">
                            <AlertCircle size={50} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Sync In Progress</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {errorMsg || "The payment may still be syncing. Please retry check once."}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={handleManualCheck}
                                disabled={isChecking}
                                className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-70"
                            >
                                {isChecking ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                                {isChecking ? "Checking..." : "Check Again"}
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="w-full py-3.5 border border-slate-200 bg-white text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
