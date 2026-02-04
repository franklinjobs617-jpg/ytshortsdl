"use client";

import { useState, useEffect } from 'react';
import { Check, X, Sparkles, Loader2, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from "@/components/ToastContext";
import { PayPalButtons } from "@paypal/react-paypal-js";
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
}

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubscriptionModal({
    isOpen,
    onClose,
}: SubscriptionModalProps) {
    const [isYearly, setIsYearly] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const { user, isLoggedIn, login } = useAuth();
    const { addToast } = useToast();

    // 支付校验状态
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // 埋点：打开模态框
    useEffect(() => {
        if (isOpen) {
            trackEvent(GA_EVENTS.F_PAYWALL_VIEW, { context: 'subscription_modal' });
        }
    }, [isOpen]);

    // --- Stripe 支付逻辑 ---
    const handleStripePayment = async (plan: Plan) => {
        if (!isLoggedIn) {
            login();
            return;
        }

        trackEvent(GA_EVENTS.F_PAY_CLICK, {
            method: 'stripe',
            plan: plan.name,
            cycle: isYearly ? 'yearly' : 'monthly',
            context: 'paywall_modal'
        });

        setLoadingPlan(plan.name);
        try {
            const typeString = `plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`;
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
            if (data.url) {
                window.location.href = data.url;
            } else {
                trackEvent(GA_EVENTS.ERR_PARSE, { context: 'modal_stripe_create', msg: 'no_url' });
                addToast("Payment gateway is busy, please try again.", "error");
            }
        } catch (error: any) {
            trackEvent(GA_EVENTS.ERR_PARSE, { context: 'modal_stripe_exception', msg: error.message });
            addToast("Connection error, please try again.", "error");
        } finally {
            setLoadingPlan(null);
        }
    };

    const plans: Plan[] = [

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

    const formatFeature = (val: number | string | null, label: string) => {
        if (val === "Unlimited" || val === "Full" || val === "Yes") return `${val} ${label}`;
        const num = typeof val === 'number' ? (isYearly ? val * 12 : val) : val;
        return `${num} ${label} / ${isYearly ? 'yr' : 'mo'}`;
    };

    if (!isOpen) return null;

    // 如果处于支付校验状态，渲染简洁的反馈界面
    if (verificationStatus !== 'idle') {
        return (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <div className="relative bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-sm w-full">
                    {verificationStatus === 'loading' && (
                        <div className="space-y-6">
                            <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto" />
                            <h2 className="text-2xl font-black">Verifying...</h2>
                        </div>
                    )}
                    {verificationStatus === 'success' && (
                        <div className="space-y-6">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                            <h2 className="text-2xl font-black text-slate-900">Success!</h2>
                            <p className="text-slate-500 font-bold">Your plan is being updated.</p>
                        </div>
                    )}
                    {verificationStatus === 'error' && (
                        <div className="space-y-6">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="text-2xl font-black text-slate-900">Failed</h2>
                            <button onClick={() => setVerificationStatus('idle')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 mx-auto">
                                <RefreshCcw size={18} /> Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-[#FDFDFD] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 border border-white scrollbar-hide">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all z-10">
                    <X size={24} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Sparkles size={12} fill="currentColor" /> Premium Plans
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">
                            Unlock Your <span className="text-red-600 italic text-4xl md:text-5xl">Creativity</span>
                        </h2>

                        <div className="flex justify-center items-center gap-4 mt-6">
                            <span className={`text-xs font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                            <button onClick={() => {
                                const next = !isYearly;
                                setIsYearly(next);
                                trackEvent(GA_EVENTS.UI_PRICING_TOGGLE, { cycle: next ? 'yearly' : 'monthly', context: 'modal' });
                            }} className="relative inline-flex h-6 w-12 items-center rounded-full bg-slate-200 focus:outline-none">
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-red-600 transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-1'}`}></span>
                            </button>
                            <span className={`text-xs font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
                                Yearly <span className="text-green-600 ml-1 text-[10px] font-black bg-green-50 px-2 py-0.5 rounded-full">Save 25%+</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {plans.map((plan, idx) => (
                            <div key={idx} className={`relative rounded-[32px] p-8 flex flex-col transition-all duration-500 border ${plan.featured ? 'bg-slate-950 text-white border-red-600 shadow-2xl' : 'bg-white border-slate-200 text-slate-900'}`}>
                                {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>}

                                <div className="mb-6">
                                    <h3 className="text-xl font-black">{plan.name}</h3>
                                    <p className={`text-xs font-medium ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tighter">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                                    <span className={`text-xs font-bold ${plan.featured ? 'text-slate-500' : 'text-slate-400'}`}>/{isYearly ? 'yr' : 'mo'}</span>
                                </div>

                                <ul className="space-y-4 mb-10 grow">
                                    {plan.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 text-left">
                                            <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" strokeWidth={4} />
                                            <span className={`text-xs ${feat.bold ? 'font-black' : 'font-medium'} ${plan.featured ? 'text-slate-200' : 'text-slate-700'}`}>
                                                {formatFeature(feat.value, feat.label)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="space-y-3">
                                    {/* Stripe 按钮 */}
                                    <button
                                        disabled={loadingPlan !== null}
                                        onClick={() => handleStripePayment(plan)}
                                        className="w-full h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e4] text-white shadow-md active:scale-95 disabled:opacity-70"
                                    >
                                        {loadingPlan === plan.name ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : (
                                            <>
                                                <span className="text-sm">Pay with</span>
                                                <img src="/StripeLogo.png" className="h-5 brightness-0 invert" alt="Stripe" />
                                            </>
                                        )}
                                    </button>

                                    {/* PayPal Smart Buttons */}
                                    <div className="w-full relative z-0">
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
                                            createOrder={async () => {
                                                if (!isLoggedIn) {
                                                    login();
                                                    throw new Error("Login required");
                                                }
                                                trackEvent(GA_EVENTS.F_PAY_CLICK, {
                                                    method: 'paypal_smart',
                                                    plan: plan.name,
                                                    cycle: isYearly ? 'yearly' : 'monthly',
                                                    context: 'paywall_modal'
                                                });
                                                const typeString = `plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`;
                                                const res = await fetch("/api/pay/paypal-smart-create", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        type: typeString,
                                                        googleUserId: user?.googleUserId || user?.id,
                                                        email: user?.email,
                                                        userId: user?.id
                                                    })
                                                });
                                                const json = await res.json();
                                                if (json.code === 200) return json.data;
                                                throw new Error(json.msg);
                                            }}
                                            onApprove={async (data) => {
                                                setVerificationStatus('loading');
                                                try {
                                                    const res = await fetch("/api/pay/paypal-smart-capture", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ orderId: data.orderID })
                                                    });
                                                    const json = await res.json();
                                                    if (json.code === 200) {
                                                        trackEvent(GA_EVENTS.F_PAY_SUCCESS, { method: 'paypal_smart', context: 'modal' });
                                                        setVerificationStatus('success');
                                                        setTimeout(() => window.location.reload(), 2000);
                                                    } else {
                                                        setVerificationStatus('error');
                                                    }
                                                } catch (err) {
                                                    setVerificationStatus('error');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}