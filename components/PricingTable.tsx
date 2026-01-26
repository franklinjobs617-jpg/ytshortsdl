"use client";

import { useState, useEffect } from "react";
import { Check, X, ChevronDown, Loader2, CreditCard, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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

    // --- 🚀 逻辑：处理 PayPal 回跳后的自动检测 ---
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
            // 使用你提供的校验地址
            const res = await fetch(`https://api.removermarca.com/prod-api/paypal/retUrl${window.location.search}`);
            const data = await res.json();
            if (data.code === 0) {
                setVerificationStatus('success');
                setTimeout(() => window.location.href = "/", 2000);
            } else {
                setVerificationStatus('error');
            }
        } catch (e) {
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
                { label: "Shorts Downloads", value: 1, included: true, bold: false },
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
                { label: "Downloads", value: "Unlimited", included: true, bold: true },
                { label: "Extractions", value: 150, included: true, bold: true },
                { label: "AI Scripting", value: 300, included: true, bold: true },
                { label: "4K Ultra HD Quality", value: "Full", included: true, bold: false },
                { label: "Ad-Free Experience", value: "Yes", included: true, bold: false },
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
                { label: "All Features", value: "Unlimited", included: true, bold: false },
                { label: "AI Scripting", value: "Unlimited", included: true, bold: false },
                { label: "Priority API Access", value: "Yes", included: true, bold: false },
                { label: "1-on-1 Premium Support", value: "Yes", included: true, bold: false },
            ],
            buttonText: "Contact Sales",
            featured: false,
        },
    ];

    // --- 🚀 核心逻辑：发起支付 ---
    const handleStartPayment = async (plan: Plan, provider: 'stripe' | 'paypal') => {
        if (plan.name === "Free") return;
        if (!isLoggedIn) { login(); return; }

        setLoadingPlan(plan.name);
        setPayProvider(provider);

        try {
            const typeString = `plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`;
            // 根据不同供应商请求不同接口
            const endpoint = provider === 'stripe' ? '/api/pay/create' : '/api/pay/paypal-create';
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
                alert("Service busy, please try again.");
            }
        } catch (error) {
            alert("Payment connection failed.");
        } finally {
            setLoadingPlan(null);
            setPayProvider(null);
        }
    };

    const formatFeature = (val: number | string | null, label: string) => {
        if (val === null) return `No ${label}`;
        if (val === "Unlimited" || val === "Full" || val === "Yes") return `${val} ${label}`;
        const num = typeof val === 'number' ? (isYearly ? val * 12 : val) : val;
        return `${num} ${label} / ${isYearly ? 'yr' : 'mo'}`;
    };

    // --- 🚀 如果处于回跳验证状态，显示全屏覆盖 ---
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

    return (
        <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 font-sans antialiased">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* 头部展示逻辑省略... 保持你之前的代码 */}
                <div className="text-center mb-10">
                    <h2 className="text-xs font-black text-red-600 tracking-widest uppercase mb-2 italic">Pricing Plans</h2>
                    <p className="text-3xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">Select the best plan for<br /> <span className="text-red-600 italic">your creativity</span></p>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button onClick={() => setIsYearly(!isYearly)} className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-100 border border-slate-200 transition-all"><span className={`inline-block h-5 w-5 transform rounded-full bg-red-600 transition-all ${isYearly ? 'translate-x-8' : 'translate-x-1'}`}></span></button>
                        <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-green-600 text-xs font-black bg-green-50 px-2 py-1 rounded-full ml-1">Save 25%+</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative rounded-[40px] p-8 md:p-10 transition-all duration-500 flex flex-col border ${plan.featured ? 'bg-slate-950 text-white shadow-2xl lg:scale-105 z-10 border-red-600' : 'bg-white border-slate-200 text-slate-900'}`}>
                            {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Most Popular</div>}

                            <div className="mb-8">
                                <h3 className="text-2xl font-black">{plan.name}</h3>
                                <p className={`text-sm font-medium ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                            </div>

                            <div className="mb-8 flex flex-col">
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-black tracking-tighter">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                                    <span className={`text-sm font-bold ml-1 ${plan.featured ? 'text-slate-500' : 'text-slate-400'}`}>{isYearly ? '/yr' : '/mo'}</span>
                                </div>
                                {isYearly && plan.name !== "Free" && <span className="text-xs text-green-500 font-bold mt-2 uppercase tracking-wider italic">Only {(parseFloat(plan.yearlyPrice.replace('$', '')) / 12).toFixed(2)}$ / month</span>}
                            </div>

                            <ul className="space-y-4 mb-12 grow text-left">
                                {plan.features.map((feat, fIdx) => (
                                    <li key={fIdx} className={`flex items-start gap-3 ${feat.included ? '' : 'opacity-30'}`}>
                                        {feat.included ? <Check className="w-5 h-5 text-red-500 shrink-0" strokeWidth={4} /> : <X className="w-5 h-5 text-slate-300 shrink-0" strokeWidth={3} />}
                                        <span className={`text-sm ${feat.bold ? 'font-black' : 'font-medium'} ${plan.featured && feat.included ? 'text-slate-200' : ''}`}>{formatFeature(feat.value, feat.label)}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* 🚀 支付按钮区域：双通道并列设计 */}
                            {plan.name === "Free" ? (
                                <button disabled className="w-full py-5 rounded-3xl font-black bg-slate-100 text-slate-400">Current Plan</button>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        disabled={loadingPlan !== null}
                                        onClick={() => handleStartPayment(plan, 'stripe')}
                                        className={`w-full text-lg py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${plan.featured ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}
                                    > Pay with
                                        {(loadingPlan === plan.name && payProvider === 'stripe') ? <Loader2 className="animate-spin" size={18} /> :
                                            <img src="/StripeLogo.png" className="h-8" alt="Stripe" />}
                                    </button>
                                    <button
                                        disabled={loadingPlan !== null}
                                        onClick={() => handleStartPayment(plan, 'paypal')}
                                        className="w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:scale-95 shadow-sm"
                                    >  Pay with
                                        {(loadingPlan === plan.name && payProvider === 'paypal') ? <Loader2 className="animate-spin" size={18} /> :
                                            <img src="/PayPalLogo.png" className="h-8" alt="PayPal" />}
                                    </button>
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