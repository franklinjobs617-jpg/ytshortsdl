"use client";

import { useState, useEffect } from "react";
import { Check, X, ChevronDown, Loader2, CreditCard, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { trackEvent, GA_EVENTS } from "@/lib/gtag"; // 🚀 引入

interface Feature {
    label: string;
    value: number | string | null;
    included: boolean;
    bold?: boolean;
}

interface Plan {
    name: string;
    desc: string;
    monthlyPrice: string;
    yearlyPrice: string;
    features: Feature[];
    buttonText: string;
    featured: boolean;
}

const PricingTable = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [payProvider, setPayProvider] = useState<'stripe' | 'paypal' | null>(null);
    const { user, isLoggedIn, login } = useAuth();

    // --- 🚀 新增：支付回调校验状态 ---
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // 🚀 埋点：进入定价页面
    useEffect(() => {
        trackEvent(GA_EVENTS.F_PRICING_VIEW);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const payerId = urlParams.get('PayerID');

        if (payerId) {
            handleVerifyPayPal();
        }
    }, []);

    const handleVerifyPayPal = async () => {
        setVerificationStatus('loading');
        try {
            const res = await fetch(`https://api.removermarca.com/prod-api/paypal/retUrl${window.location.search}`);
            const data = await res.json();
            if (data.code === 0) {
                // 🚀 埋点：支付校验成功
                trackEvent(GA_EVENTS.F_PAY_SUCCESS, { method: 'paypal', type: 'url_verify' });
                setVerificationStatus('success');
                setTimeout(() => window.location.href = "/", 2000);
            } else {
                // 🚀 埋点：支付校验失败
                trackEvent(GA_EVENTS.ERR_PARSE, { context: 'paypal_verify', msg: data.msg });
                setVerificationStatus('error');
            }
        } catch (e: any) {
            trackEvent(GA_EVENTS.ERR_PARSE, { context: 'paypal_verify_exception', msg: e.message });
            setVerificationStatus('error');
        }
    };

    const plans: Plan[] = [
        {
            name: "Free",
            desc: "Perfect for occasional users.",
            monthlyPrice: "$0",
            yearlyPrice: "$0",
            features: [
                { label: "SD Video & Shorts  Downloads", value: 3, included: true, bold: false },
                { label: "Subtitle Extractions", value: 1, included: true, bold: false },
                { label: "AI Script Generations", value: 1, included: true, bold: false },
                { label: "4K Support", value: null, included: false, bold: false },
            ],
            buttonText: "Current Plan",
            featured: false,
        },
        {
            name: "Pro",
            desc: "Best for creators.",
            monthlyPrice: "$12.90",
            yearlyPrice: "$99",
            features: [
                { label: "SD Video & Shorts Downloads", value: "Unlimited", included: true, bold: true },
                { label: "4K Ultra Quality", value: 300, included: true, bold: true },
                { label: "Extractions", value: 300, included: true, bold: true },
                { label: "AI Scripting", value: 300, included: true, bold: true },
                { label: "Ad-Free Experience", value: "", included: true, bold: false },
            ],
            buttonText: "Upgrade Now",
            featured: true,
        },
        {
            name: "Elite",
            desc: "For MCNs & Power Users.",
            monthlyPrice: "$29.90",
            yearlyPrice: "$199",
            features: [
                { label: "4K Ultra Quality", value: "Unlimited", included: true, bold: false },
                { label: "All Features", value: "Unlimited", included: true, bold: false },
                { label: "AI Scripting", value: "Unlimited", included: true, bold: false },
                { label: "Priority API Access", value: "Yes", included: true, bold: false },
                { label: "1-on-1 Premium Support", value: "Yes", included: true, bold: false },
            ],
            buttonText: "Contact Sales",
            featured: false,
        },
    ];

    // --- Stripe Logic ---
    const handleStripePayment = async (plan: Plan) => {
        if (!isLoggedIn) { login(); return; }

        // 🚀 埋点：点击支付（Stripe）
        trackEvent(GA_EVENTS.F_PAY_CLICK, {
            method: 'stripe',
            plan: plan.name,
            cycle: isYearly ? 'yearly' : 'monthly'
        });

        setLoadingPlan(plan.name);
        setPayProvider('stripe');

        try {
            const typeString = `plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`;
            const endpoint = '/api/pay/create';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    googleUserId: user?.googleUserId,
                    email: user?.email,
                    userId: user?.id,
                    type: typeString
                })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                trackEvent(GA_EVENTS.ERR_PARSE, { context: 'stripe_create', msg: 'no_url' });
                alert("Service busy, please try again.");
            }
        } catch (error: any) {
            trackEvent(GA_EVENTS.ERR_PARSE, { context: 'stripe_exception', msg: error.message });
            alert("Payment connection failed.");
        } finally {
            setLoadingPlan(null);
            setPayProvider(null);
        }
    };

    const formatFeature = (val: number | string | null, label: string, planName: string) => {
        if (val === null) return `No ${label}`;
        if (val === "Unlimited" || val === "Full" || val === "Yes") return `${val} ${label}`;

        let periodicity = isYearly ? '/ yr' : '/ mo';
        if (planName === "Free") {
            periodicity = " / day";
        }

        const num = typeof val === 'number' ? (isYearly && planName !== "Free" ? val * 12 : val) : val;
        return `${num} ${label}${periodicity}`;
    };

    if (verificationStatus !== 'idle') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                {verificationStatus === 'loading' && (
                    <div className="space-y-6">
                        <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto" />
                        <h2 className="text-2xl font-black">Verifying Payment...</h2>
                        <p className="text-slate-500">Please do not close this window.</p>
                    </div>
                )}
                {verificationStatus === 'success' && (
                    <div className="space-y-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                        <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
                        <p className="text-slate-500">Welcome to {user?.givenName} Pro. Redirecting...</p>
                    </div>
                )}
                {verificationStatus === 'error' && (
                    <div className="space-y-6">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-black text-slate-900">Payment Verification Failed</h2>
                        <button onClick={() => window.location.href = "/pricing"} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 mx-auto">
                            <RefreshCcw size={18} /> Retry or Contact Support
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const paypalOptions: ReactPayPalScriptOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture",
        components: "buttons", // Only load buttons
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 font-sans antialiased">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="text-center mb-10">
                    <h2 className="text-xs font-black text-red-600 tracking-widest uppercase mb-2 italic">Pricing Plans</h2>
                    <p className="text-3xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">Select the best plan for<br /> <span className="text-red-600 italic">your creativity</span></p>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button onClick={() => {
                            const next = !isYearly;
                            setIsYearly(next);
                            // 🚀 埋点：周期切换
                            trackEvent(GA_EVENTS.UI_PRICING_TOGGLE, { cycle: next ? 'yearly' : 'monthly' });
                        }} className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-100 border border-slate-200 transition-all"><span className={`inline-block h-5 w-5 transform rounded-full bg-red-600 transition-all ${isYearly ? 'translate-x-8' : 'translate-x-1'}`}></span></button>
                        <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-green-600 text-xs font-black bg-green-50 px-2 py-1 rounded-full ml-1">Save 25%+</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative rounded-[40px] p-6 transition-all duration-500 flex flex-col border ${plan.featured ? 'bg-slate-950 text-white shadow-2xl lg:scale-105 z-10 border-red-600' : 'bg-white border-slate-200 text-slate-900'}`}>
                            {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Most Popular</div>}

                            <div className="mb-4">
                                <h3 className="text-2xl font-black">{plan.name}</h3>
                                <p className={`text-sm font-medium ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                            </div>

                            <div className="mb-8 flex flex-col">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-black tracking-tighter">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                                    <span className={`text-sm font-bold ml-1 ${plan.featured ? 'text-slate-500' : 'text-slate-400'}`}>{isYearly ? '/yr' : '/mo'}</span>
                                </div>
                                {isYearly && plan.name !== "Free" && <span className="text-xs text-green-500 font-bold mt-2 uppercase tracking-wider italic">Only {(parseFloat(plan.yearlyPrice.replace('$', '')) / 12).toFixed(2)}$ / month</span>}
                            </div>

                            <ul className="space-y-3 mb-6 grow text-left">
                                {plan.features.map((feat, fIdx) => (
                                    <li key={fIdx} className={`flex items-start gap-3 ${feat.included ? '' : 'opacity-40 grayscale'}`}>
                                        {feat.included ? <Check className="w-5 h-5 text-red-500 shrink-0" strokeWidth={4} /> : <X className="w-5 h-5 text-slate-300 shrink-0" strokeWidth={3} />}
                                        <span className={`text-sm ${feat.bold ? 'font-black' : 'font-medium'} ${plan.featured && feat.included ? 'text-slate-200' : ''}`}>{formatFeature(feat.value, feat.label, plan.name)}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* 🚀 支付按钮区域 */}
                            {plan.name === "Free" ? (
                                <button disabled className="w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed">Current Plan</button>
                            ) : (
                                <div className="space-y-3 flex flex-col items-center w-full">
                                    {/* Stripe Button */}
                                    <button
                                        disabled={loadingPlan !== null}
                                        onClick={() => handleStripePayment(plan)}
                                        className="w-full h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e4] text-white shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loadingPlan === plan.name ? (
                                            <>
                                                <Loader2 className="animate-spin w-5 h-5" />
                                                <span className="text-sm">Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm">Pay with</span>
                                                <img src="/StripeLogo.png" className="h-6 brightness-0 invert" alt="Stripe" />
                                            </>
                                        )}
                                    </button>

                                    {/* PayPal Direct Button */}
                                    <div className="w-full h-12 relative z-0 mt-3">
                                        {!setLoadingPlan ? (
                                            <button disabled className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#ffc439] opacity-50 cursor-not-allowed text-slate-900 border border-transparent shadow-sm">
                                                <Loader2 className="animate-spin w-4 h-4" />
                                                <span className="text-sm italic">Loading PayPal...</span>
                                            </button>
                                        ) : (
                                            <PayPalButtons
                                                fundingSource="paypal"
                                                style={{
                                                    layout: "vertical",
                                                    shape: "rect",
                                                    borderRadius: 12,
                                                    height: 48,
                                                    label: 'pay'
                                                }}
                                                forceReRender={[isYearly, plan.name]}
                                                createOrder={async (data, actions) => {
                                                    if (!isLoggedIn) {
                                                        login();
                                                        throw new Error("Please login first");
                                                    }

                                                    // 🚀 埋点：点击支付（PayPal）
                                                    trackEvent(GA_EVENTS.F_PAY_CLICK, {
                                                        method: 'paypal_smart',
                                                        plan: plan.name,
                                                        cycle: isYearly ? 'yearly' : 'monthly'
                                                    });

                                                    const typeString = `plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`;
                                                    try {
                                                        const response = await fetch("/api/pay/paypal-smart-create", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                type: typeString,
                                                                googleUserId: user?.googleUserId || user?.id,
                                                                email: user?.email,
                                                                userId: user?.id
                                                            })
                                                        });
                                                        const res = await response.json();
                                                        if (res.code === 200 && res.data) {
                                                            return res.data;
                                                        } else {
                                                            throw new Error(res.msg);
                                                        }
                                                    } catch (err: any) {
                                                        trackEvent(GA_EVENTS.ERR_PARSE, { context: 'paypal_create', msg: err.message });
                                                        throw err;
                                                    }
                                                }}
                                                onApprove={async (data, actions) => {
                                                    try {
                                                        const response = await fetch("/api/pay/paypal-smart-capture", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ orderId: data.orderID })
                                                        });
                                                        const res = await response.json();
                                                        if (res.code === 200) {
                                                            // 🚀 埋点：支付成功（PayPal Capture）
                                                            trackEvent(GA_EVENTS.F_PAY_SUCCESS, { method: 'paypal_smart' });
                                                            setVerificationStatus('success');
                                                            setTimeout(() => window.location.reload(), 2000);
                                                        } else {
                                                            trackEvent(GA_EVENTS.ERR_PARSE, { context: 'paypal_capture', msg: res.msg });
                                                            alert("Payment Capture Failed: " + res.msg);
                                                        }
                                                    } catch (err: any) {
                                                        trackEvent(GA_EVENTS.ERR_PARSE, { context: 'paypal_capture_exception', msg: err.message });
                                                        alert("Capture Error");
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingTable;