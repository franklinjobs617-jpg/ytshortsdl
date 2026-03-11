"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { trackEvent, GA_EVENTS } from "@/lib/gtag";

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
    isTest?: boolean; // 新增：标识是否为测试套餐
}

const PricingTable = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const { user, isLoggedIn, login } = useAuth();
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        trackEvent(GA_EVENTS.F_PRICING_VIEW);
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('PayerID') || urlParams.get('subscription_id') || urlParams.get('token')) {
            handleVerifyPayPal();
        }
    }, []);

    const handleVerifyPayPal = async () => {
        setVerificationStatus('loading');
        try {
            const res = await fetch(`https://api.ytshortsdl.net/prod-api/paypal/retUrl${window.location.search}`);
            const data = await res.json();
            if (data.code === 0) {
                setVerificationStatus('success');
                setTimeout(() => window.location.href = "/", 2000);
            } else {
                setVerificationStatus('error');
            }
        } catch (e: any) {
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
                { label: "SD Video & Shorts Downloads", value: 3, included: true, bold: false },
                { label: "Subtitle Extractions", value: 1, included: true, bold: false },
                { label: "AI Script Generations", value: 1, included: true, bold: false },
                { label: "4K Support", value: null, included: false, bold: false },
            ],
            buttonText: "Current Plan",
            featured: false,
        },
        // --- 🚀 新增：0.2$ 测试套餐 ---
        {
            name: "Test",
            desc: "Internal System Verification.",
            monthlyPrice: "$2",
            yearlyPrice: "$2",
            features: [
                { label: "System Test", value: "Full", included: true, bold: false },
                { label: "Official ID", value: "plan_test_020", included: true, bold: false },
            ],
            buttonText: "Pay $2",
            featured: false,
            isTest: true
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

    // 获取对应的后端 Type String
    const getTypeString = (plan: Plan) => {
        if (plan.isTest) return "plan_test_020"; // 如果是测试项，直接返回该 ID
        return `plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`;
    };

    const handleStripePayment = async (plan: Plan) => {
        if (!isLoggedIn) { login(); return; }
        setLoadingPlan(plan.name);
        try {
            const typeString = getTypeString(plan);
            const res = await fetch('/api/pay/create', {
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
            if (data.url) window.location.href = data.url;
        } catch (error) {
            alert("Connection failed");
        } finally {
            setLoadingPlan(null);
        }
    };

    const formatFeature = (val: number | string | null, label: string, planName: string) => {
        if (val === null) return `No ${label}`;
        if (val === "Unlimited" || val === "Full" || val === "Yes") return `${val} ${label}`;
        let periodicity = isYearly ? '/ yr' : '/ mo';
        if (planName === "Free") periodicity = " / day";
        const num = typeof val === 'number' ? (isYearly && planName !== "Free" ? val * 12 : val) : val;
        return `${num} ${label}${periodicity}`;
    };

    if (verificationStatus !== 'idle') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                {verificationStatus === 'loading' && (
                    <div className="space-y-6">
                        <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto" />
                        <h2 className="text-2xl font-black">Verifying...</h2>
                    </div>
                )}
                {verificationStatus === 'success' && (
                    <div className="space-y-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                        <h2 className="text-2xl font-black">Success!</h2>
                    </div>
                )}
                {verificationStatus === 'error' && (
                    <div className="space-y-6">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-black">Failed</h2>
                        <button onClick={() => window.location.href = "/pricing"} className="px-8 py-3 bg-slate-900 text-white rounded-2xl">Retry</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="py-12 px-4 bg-white text-slate-900">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-10">
                <h2 className="text-xs font-black text-red-600 tracking-widest uppercase mb-2">Pricing</h2>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">Ready to <span className="text-red-600 italic">Upgrade?</span></h1>
                
                <div className="flex items-center gap-4 mb-10">
                    <span className="text-sm font-bold">Monthly</span>
                    <button onClick={() => setIsYearly(!isYearly)} className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-100 border transition-all">
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-red-600 transition-all ${isYearly ? 'translate-x-8' : 'translate-x-1'}`}></span>
                    </button>
                    <span className="text-sm font-bold">Yearly (-25%)</span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full items-stretch">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative rounded-[40px] p-8 transition-all flex flex-col border ${plan.featured ? 'bg-slate-950 text-white shadow-2xl scale-105 z-10 border-red-600' : 'bg-white border-slate-200'}`}>
                            
                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-left">{plan.name}</h3>
                                <p className={`text-sm text-left ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                            </div>

                            <div className="mb-8 flex items-baseline">
                                <span className="text-4xl font-black tracking-tighter">{plan.isTest ? plan.monthlyPrice : (isYearly ? plan.yearlyPrice : plan.monthlyPrice)}</span>
                                <span className="text-sm font-bold ml-1 text-slate-400">/period</span>
                            </div>

                            <ul className="space-y-4 mb-8 grow">
                                {plan.features.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-red-500 shrink-0" strokeWidth={3} />
                                        <span className="text-sm font-medium text-left">{formatFeature(feat.value, feat.label, plan.name)}</span>
                                    </li>
                                ))}
                            </ul>

                            {plan.name === "Free" ? (
                                <button disabled className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-slate-400 cursor-not-allowed">Current Plan</button>
                            ) : (
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => handleStripePayment(plan)}
                                        className="w-full py-3.5 rounded-2xl font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-95"
                                    >
                                        Stripe
                                    </button>

                                    <PayPalButtons
                                        fundingSource="paypal"
                                        style={{ layout: "vertical", shape: "rect", borderRadius: 12, height: 48, label: 'subscribe' }}
                                        createSubscription={async () => {
                                            if (!isLoggedIn) { login(); throw new Error("Login"); }
                                            const response = await fetch("/api/pay/paypal-smart-create-subscription", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    type: getTypeString(plan),
                                                    googleUserId: user?.googleUserId || user?.id,
                                                    email: user?.email,
                                                    userId: user?.id
                                                })
                                            });
                                            const res = await response.json();
                                            return res.data;
                                        }}
                                        onApprove={async (data) => {
                                            setVerificationStatus('success');
                                            setTimeout(() => window.location.href = "/", 2000);
                                        }}
                                    />
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