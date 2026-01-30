"use client";

import React, { useState } from 'react';
import { X, Gift, Star, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { trackEvent, GA_EVENTS } from '@/lib/gtag';
import { useToast } from "@/components/ToastContext";


interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SurveyModal({ isOpen, onClose }: SurveyModalProps) {
    const { completeSurvey, user } = useAuth();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answers, setAnswers] = useState({
        purpose: '',
        source: '',
        rating: 5
    });

    if (!isOpen) return null;

    const handleNext = () => setStep(step + 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        trackEvent(GA_EVENTS.UI_SURVEY_SUBMIT, { ...answers });

        const success = await completeSurvey(answers);
        if (success) {
            localStorage.setItem(`survey_done_${user?.id}`, 'true');
            addToast("Survey completed! +10 Credits added.", "success");
            setStep(4); // 显示成功页面
            setTimeout(() => {
                onClose();
                setStep(1); // 重置以便下次使用
            }, 3000);
        } else {
            addToast("Failed to submit survey", "error");
        }
        setIsSubmitting(false);
    };

    const handleSkip = () => {
        trackEvent(GA_EVENTS.UI_SURVEY_SKIP);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={handleSkip} />

            <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                {step < 4 && (
                    <button onClick={handleSkip} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} strokeWidth={3} />
                    </button>
                )}

                <div className="p-8">
                    {/* Header */}
                    {step < 4 && (
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 animate-pulse">
                                <Gift size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-none">Quick Survey</h3>
                                <p className="text-[10px] text-red-600 font-bold uppercase mt-1 tracking-widest">Get +10 Credits</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Purpose */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <p className="text-sm font-bold text-slate-800 mb-4">What's your primary goal today?</p>
                            <div className="space-y-2">
                                {['Content Creation', 'Personal Use', 'Learning/Study', 'Other'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => { setAnswers({ ...answers, purpose: item }); handleNext(); }}
                                        className="w-full p-4 text-left rounded-2xl border border-slate-100 bg-slate-50 hover:border-red-500 hover:bg-red-50 transition-all text-sm font-medium text-slate-700"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Source */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <p className="text-sm font-bold text-slate-800 mb-4">How did you find us?</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['Google', 'TikTok/YT', 'Twitter', 'Friend', 'Ads', 'Other'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => { setAnswers({ ...answers, source: item }); handleNext(); }}
                                        className="p-4 text-center rounded-2xl border border-slate-100 bg-slate-50 hover:border-red-500 hover:bg-red-50 transition-all text-xs font-bold text-slate-700"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Rating */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-4 duration-300 text-center">
                            <p className="text-sm font-bold text-slate-800 mb-6">Rate your experience</p>
                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setAnswers({ ...answers, rating: star })}
                                        className={`transition-all ${answers.rating >= star ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}
                                    >
                                        <Star size={32} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={18} fill="currentColor" />}
                                {isSubmitting ? "Processing..." : "Claim +10 Credits"}
                            </button>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="py-10 text-center animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={48} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Thank You!</h3>
                            <p className="text-sm text-slate-500 font-medium italic">10 Credits added to your account.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}