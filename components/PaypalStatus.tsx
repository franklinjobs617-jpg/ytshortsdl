"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

const isPaySuccess = (payload: any) => {
    const code = payload?.code;
    const status = (payload?.status || payload?.data?.status || '').toString().toLowerCase();
    const paidStatus = (payload?.paymentStatus || payload?.data?.paymentStatus || '').toString().toLowerCase();
    return (
        code === 0 ||
        code === 200 ||
        status === 'success' ||
        status === 'succeeded' ||
        status === 'completed' ||
        paidStatus === 'paid' ||
        paidStatus === 'succeeded'
    );
};

export default function PaypalStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [attempts, setAttempts] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [errorMsg, setErrorMsg] = useState(""); // 替代 alert

    const MAX_ATTEMPTS = 12; 
    const API_URL = "https://api.ytshortsdl.net/prod-api/paypal/retUrl";

    const checkPayment = useCallback(async () => {
        const queryStr = searchParams.toString();
        const payerId = searchParams.get('PayerID');
        const token = searchParams.get('token');
        const subId = searchParams.get('subscription_id');
        const baToken = searchParams.get('ba_token');

        // 兼容订阅 ID 检查
        if (!payerId && !token && !subId && !baToken) {
            setStatus('error');
            setErrorMsg("Missing transaction identifiers.");
            return 'FAILURE';
        }

        try {
            const response = await fetch(`${API_URL}?${queryStr}`);
            const data = await response.json();

            if (isPaySuccess(data)) {
                setStatus('success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
                return 'SUCCESS';
            }
            return 'PENDING';
        } catch (error) {
            console.error("Verification error:", error);
            return 'ERROR';
        }
    }, [searchParams, router]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const poll = async () => {
            if (status === 'success' || attempts >= MAX_ATTEMPTS) return;

            const result = await checkPayment();
            if (result !== 'SUCCESS') {
                setAttempts(prev => prev + 1);
                timer = setTimeout(poll, 3000); 
            }
        };

        poll();
        return () => clearTimeout(timer);
    }, [attempts, status, checkPayment]);

    useEffect(() => {
        if (attempts >= MAX_ATTEMPTS && status === 'loading') {
            setStatus('error');
            setErrorMsg("We couldn't confirm your payment in time. Please check your account later.");
        }
    }, [attempts, status]);

    const handleManualCheck = async () => {
        setIsChecking(true);
        setErrorMsg(""); 
        const result = await checkPayment();
        if (result !== 'SUCCESS') {
            setErrorMsg("Payment not detected yet. It might take a minute to sync.");
        }
        setIsChecking(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
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
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in zoom-in-90">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-lg shadow-green-100">
                            <CheckCircle2 size={48} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Success!</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Your transaction is complete. Your plan limits have been upgraded. <br />
                            <span className="text-red-600 font-bold">Redirecting you now...</span>
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                            <AlertCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Pending Sync</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {errorMsg || "PayPal might be slow today. If you have completed the payment, please try a manual check."}
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
        </div>
    );
}
