"use client";

import { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";

// --- 1. 定义明确的类型接口 ---
interface Feature {
    label: string;
    value: number | string | null;
    included: boolean;
    bold?: boolean; // 使用 ? 表示可选属性
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

    // --- 2. 使用定义的 Plan[] 类型 ---
    const plans: Plan[] = [
        {
            name: "Free",
            desc: "Perfect for occasional users.",
            monthlyPrice: "$0",
            yearlyPrice: "$0",
            features: [
                { label: "Shorts Downloads", value: 10, included: true, bold: false },
                { label: "Subtitle Extractions", value: 3, included: true, bold: false },
                { label: "AI Script Generations", value: 5, included: true, bold: false },
                { label: "4K Support", value: null, included: false, bold: false },
            ],
            buttonText: "Get Started",
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

    const formatFeature = (val: number | string | null, label: string) => {
        if (val === null) return `No ${label}`;
        if (val === "Unlimited" || val === "Full" || val === "Yes") return `${val} ${label}`;

        const num = val;
        return `${num} ${label} / mo`;
    };

    return (
        <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 font-sans antialiased overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* 头部标题 */}
                <div className="text-center mb-6 lg:mb-8">
                    <h2 className="text-[10px] md:text-xs font-black text-red-600 tracking-[0.2em] uppercase mb-1">Pricing Plans</h2>
                    <p className="text-2xl md:text-6xl font-black text-slate-900 leading-tight">
                        Select the best plan for<br /> <span className="text-red-600 italic">your creativity</span>
                    </p>

                    {/* 切换开关 */}
                    <div className="mt-4 flex justify-center items-center gap-3">
                        <span className={`text-xs md:text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative inline-flex h-5 w-10 md:h-6 md:w-12 items-center rounded-full bg-slate-200 transition-colors focus:outline-none"
                        >
                            <span className={`inline-block h-3.5 w-3.5 md:h-4 md:w-4 transform rounded-full bg-red-600 transition-transform ${isYearly ? 'translate-x-5 md:translate-x-7' : 'translate-x-1'}`}></span>
                        </button>
                        <span className={`text-xs md:text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
                            Yearly <span className="text-green-600 text-[10px] md:text-[11px] font-black bg-green-50 px-2 py-0.5 rounded-full">(Save 25%+)</span>
                        </span>
                    </div>
                </div>

                {/* 卡片展示 */}
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-[24px] md:rounded-[32px] p-5 md:p-8 transition-all duration-500 flex flex-col border ${plan.featured
                                ? 'bg-slate-950 text-white shadow-2xl lg:scale-105 z-10 border-red-600'
                                : 'bg-white border-slate-200 hover:border-red-200 text-slate-900'
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-4 md:mb-6 text-left">
                                <h3 className={`text-lg md:text-xl font-black ${plan.featured ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                <p className={`text-[11px] md:text-xs font-medium ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                            </div>

                            <div className="mb-4 md:mb-6 flex flex-col items-start">
                                <div className="flex items-baseline">
                                    <span className="text-3xl md:text-4xl font-black tracking-tighter">
                                        {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                    </span>
                                    <span className={`text-[10px] font-bold ml-1 ${plan.featured ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {isYearly ? '/yr' : '/mo'}
                                    </span>
                                </div>
                                {isYearly && plan.name !== "Free" && (
                                    <span className="text-[10px] text-green-500 font-bold mt-1">
                                        Only {(parseFloat(plan.yearlyPrice.replace('$', '')) / 12).toFixed(2)}$ / mo
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-3 md:space-y-4 text-[12px] md:text-[13px] mb-6 md:mb-8 grow text-left">
                                {plan.features.map((feat, fIdx) => (
                                    <li key={fIdx} className={`flex items-start gap-2 ${feat.included ? '' : 'opacity-40'}`}>
                                        {feat.included ? (
                                            <Check className="w-4 h-4 text-red-500 shrink-0" strokeWidth={4} />
                                        ) : (
                                            <X className={`w-4 h-4 shrink-0 ${plan.featured ? 'text-slate-700' : 'text-slate-300'}`} strokeWidth={3} />
                                        )}
                                        {/* 这里使用了 feat.bold ? ... : ... 不再报错 */}
                                        <span className={`${feat.bold ? 'font-black' : 'font-medium'} ${plan.featured && feat.included ? 'text-slate-200' : ''}`}>
                                            {formatFeature(feat.value, feat.label)}

                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 md:py-4 rounded-xl font-black text-xs md:text-sm transition-all active:scale-[0.98] ${plan.featured
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-slate-900 hover:bg-red-600 text-white'
                                }`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ 部分 */}
            <section id="faq" className="max-w-2xl mx-auto mt-16 md:mt-24">
                <h2 className="text-xl md:text-2xl font-black text-center mb-6 tracking-tighter text-slate-900 italic uppercase">FAQ</h2>
                <div className="space-y-2">
                    {[
                        { q: "Is the basic downloader free?", a: "The core YouTube Shorts downloader will always be free." },
                        { q: "Can I cancel anytime?", a: "Yes, cancel your subscription at any time through account settings." },
                    ].map((item, i) => (
                        <details key={i} className="group bg-slate-50 border border-slate-100 rounded-xl p-4 cursor-pointer hover:bg-slate-100 transition-all text-left">
                            <summary className="flex items-center justify-between font-bold text-xs md:text-sm text-slate-800 list-none">
                                {item.q}
                                <ChevronDown className="w-4 h-4 text-red-500 transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="mt-2 text-slate-500 text-[11px] md:text-xs leading-relaxed italic">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PricingTable;