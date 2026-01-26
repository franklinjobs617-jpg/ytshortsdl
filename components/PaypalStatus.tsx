"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

export default function PaypalStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [attempts, setAttempts] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const MAX_ATTEMPTS = 10; // 最大重试次数
    const API_URL = "https://api.ytshortsdl.net/prod-api/paypal/retUrl";

    // --- 🚀 核心逻辑：检查支付状态 ---
    const checkPayment = useCallback(async () => {
        const queryStr = searchParams.toString();

        // 如果没有关键参数，直接判定失败
        if (!searchParams.get('PayerID') && !searchParams.get('token')) {
            setStatus('error');
            return 'FAILURE';
        }

        try {
            const response = await fetch(`${API_URL}?${queryStr}`);
            const data = await response.json();

            if (data.code === 0 || data.status === 'success') {
                setStatus('success');
                // 成功后 3 秒跳转回首页
                setTimeout(() => router.push('/'), 3000);
                return 'SUCCESS';
            }
            return 'PENDING';
        } catch (error) {
            console.error("Verification error:", error);
            return 'ERROR';
        }
    }, [searchParams, router]);

    // --- 🚀 逻辑：自动轮询 ---
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const poll = async () => {
            if (status === 'success' || attempts >= MAX_ATTEMPTS) return;

            const result = await checkPayment();
            if (result !== 'SUCCESS') {
                setAttempts(prev => prev + 1);
                timer = setTimeout(poll, 3000); // 每 3 秒查一次
            }
        };

        poll();
        return () => clearTimeout(timer);
    }, [attempts, status, checkPayment]);

    // 轮询次数耗尽检查
    useEffect(() => {
        if (attempts >= MAX_ATTEMPTS && status === 'loading') {
            setStatus('error');
        }
    }, [attempts, status]);

    // 手动重试
    const handleManualCheck = async () => {
        setIsChecking(true);
        const result = await checkPayment();
        if (result !== 'SUCCESS') {
            alert("Payment not detected yet. Please try again in a minute.");
        }
        setIsChecking(false);
    };

    return (
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 md:p-14 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-500">

            {status === 'loading' && (
                <div className="space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                        <Loader2 className="w-20 h-20 animate-spin text-red-600" strokeWidth={3} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black text-slate-400">{attempts}/{MAX_ATTEMPTS}</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Verifying Payment</h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        We are syncing with PayPal to upgrade your account. This usually takes a few seconds.
                    </p>
                    <button
                        onClick={handleManualCheck}
                        disabled={isChecking}
                        className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
                    >
                        {isChecking ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />}
                        Check Manually
                    </button>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6 animate-in zoom-in-90">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-lg shadow-green-100">
                        <CheckCircle2 size={48} strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Success!</h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Your transaction is complete. Your credits have been added. <br />
                        <span className="text-red-600 font-bold">Redirecting you now...</span>
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Wait, no record found</h2>
                    <p className="text-slate-500 text-sm font-medium">
                        PayPal might be slow today. If you have completed the payment, please try a manual check or contact support.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleManualCheck}
                            disabled={isChecking}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-all active:scale-95"
                        >
                            {isChecking ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                            {isChecking ? 'Checking...' : 'Check Status Again'}
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}