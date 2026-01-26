"use client";

import React, { useState } from 'react';
import { Check, X, Sparkles, ChevronRight, Loader2 } from 'lucide-react';

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

// 🚀 确保这里的接口名称和属性完全匹配
interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (planType: string) => Promise<void> | void; // 必须有这一行
    isLoading: boolean; // 必须有这一行
}

export default function SubscriptionModal({
    isOpen,
    onClose,
    onUpgrade,
    isLoading
}: SubscriptionModalProps) {
    const [isYearly, setIsYearly] = useState(false);

    const plans: Plan[] = [
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

    const formatFeature = (val: number | string | null, label: string) => {
        if (val === "Unlimited" || val === "Full" || val === "Yes") return `${val} ${label}`;
        const num = typeof val === 'number' ? (isYearly ? val * 12 : val) : val;
        return `${num} ${label} / ${isYearly ? 'yr' : 'mo'}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-[#FDFDFD] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 border border-white">
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
                            <button onClick={() => setIsYearly(!isYearly)} className="relative inline-flex h-6 w-12 items-center rounded-full bg-slate-200 focus:outline-none">
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
                                <button
                                    disabled={isLoading}
                                    onClick={() => onUpgrade(`plan_${plan.name.toLowerCase()}_${isYearly ? 'yearly' : 'monthly'}`)}
                                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${plan.featured ? 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-900/30' : 'bg-slate-900 hover:bg-red-600 text-white'}`}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                                    {isLoading ? "Connecting..." : plan.buttonText}
                                    {!isLoading && <ChevronRight size={16} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}