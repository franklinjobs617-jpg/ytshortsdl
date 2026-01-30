"use client";

import React, { useState } from 'react';
import { X, Gift, CheckCircle2, Loader2, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
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
        improvement: '',
        payingFeature: '',
        feedback: ''
    });

    if (!isOpen) return null;

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    const handleAnswer = (field: string, value: string) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            trackEvent(GA_EVENTS.UI_SURVEY_SUBMIT, {
                purpose: answers.purpose,
                improvement: answers.improvement,
                paying_feature: answers.payingFeature
            });

            const success = await completeSurvey({
                purpose: answers.purpose,
                improvement: answers.improvement,
                payingFeature: answers.payingFeature,
                feedback: answers.feedback
            });

            if (success) {
                if (user?.id) {
                    localStorage.setItem(`survey_done_${user.id}`, 'true');
                }
                addToast("5 Free Downloads rewarded!", "success");
                setStep(5);
                setTimeout(() => {
                    onClose();
                    setTimeout(() => setStep(1), 500);
                }, 4000);
            }
        } catch (err) {
            addToast("Failed to submit survey", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        trackEvent(GA_EVENTS.UI_SURVEY_SKIP);
        onClose();
    };

    const goBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={handleSkip} />

            <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">

                {/* Progress Bar */}
                {step <= totalSteps && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <div className="p-8 md:p-10">
                    {/* Header Actions */}
                    {step <= totalSteps && (
                        <div className="flex justify-between items-center mb-8">
                            <button
                                onClick={goBack}
                                className={`p-2 rounded-full transition-all ${step > 1 ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                <ArrowLeft size={20} strokeWidth={3} />
                            </button>

                            {/* Reward Badge - Constantly reminds user of the prize */}
                            <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                                <Gift size={14} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-tight">+5 Free Downloads</span>
                            </div>

                            <button onClick={handleSkip} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                    )}

                    {/* Step 1: Purpose */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                Step 01 / 04
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">What is your primary goal for downloading videos?</h3>
                            <p className="text-slate-500 text-sm mb-8">Help us improve the tools you use most.</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Video Creator (Repurposing, editing)', val: 'Creator' },
                                    { label: 'Marketer (Ads, Competitor analysis)', val: 'Marketing' },
                                    { label: 'Education (Saving study materials)', val: 'Education' },
                                    { label: 'Personal Collection (Watching offline)', val: 'Personal' }
                                ].map((opt) => (
                                    <button key={opt.val} onClick={() => handleAnswer('purpose', opt.val)}
                                        className="group w-full p-5 text-left rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-red-600 hover:bg-white transition-all flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-red-600">{opt.label}</span>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Improvements */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                Step 02 / 04
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Which improvement do you need most?</h3>
                            <p className="text-slate-500 text-sm mb-8">Tell us what's currently missing or slow.</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Parsing Speed (Want instant results)', val: 'Speed' },
                                    { label: 'Video Quality (Support 2K/4K)', val: 'Quality' },
                                    { label: 'AI Features (Accurate transcription)', val: 'AI' },
                                    { label: 'Batch Processing (Full playlists)', val: 'Batch' }
                                ].map((opt) => (
                                    <button key={opt.val} onClick={() => handleAnswer('improvement', opt.val)}
                                        className="group w-full p-5 text-left rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-red-600 hover:bg-white transition-all flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-red-600">{opt.label}</span>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Monetization */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                Step 03 / 04
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Which premium feature would you pay for?</h3>
                            <p className="text-slate-500 text-sm mb-8">Help us prioritize our Pro roadmap.</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Unlimited High-Speed Batch Downloads', val: 'Batch_Premium' },
                                    { label: 'AI Video-to-Script/Blog Rewrite', val: 'AI_Repurpose' },
                                    { label: 'Automatic Watermark Removal', val: 'Watermark' },
                                    { label: 'Save to Cloud (GDrive/Dropbox)', val: 'Cloud' }
                                ].map((opt) => (
                                    <button key={opt.val} onClick={() => handleAnswer('payingFeature', opt.val)}
                                        className="group w-full p-5 text-left rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-red-600 hover:bg-white transition-all flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-red-600">{opt.label}</span>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Feedback & Reward Claim */}
                    {step === 4 && (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                                        Final Step
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Any other feedback?</h3>
                                </div>
                            </div>

                            <textarea
                                value={answers.feedback}
                                onChange={(e) => setAnswers({ ...answers, feedback: e.target.value })}
                                placeholder="Suggest websites to support or report bugs... (Optional)"
                                className="w-full h-40 p-6 rounded-[24px] bg-slate-50 border-2 border-slate-100 outline-none focus:border-red-600 focus:bg-white transition-all text-sm font-medium text-slate-700 mb-8 resize-none"
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-200 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={24} fill="currentColor" />}
                                <span>{isSubmitting ? "Sending..." : "Claim My 5 Free Downloads"}</span>
                            </button>
                        </div>
                    )}

                    {/* Step 5: Success Screen */}
                    {step === 5 && (
                        <div className="py-12 text-center animate-in zoom-in-95 duration-700">
                            <div className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                                <CheckCircle2 size={64} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Congratulations!</h3>
                            <div className="inline-block px-6 py-2 bg-green-50 text-green-700 rounded-full font-black text-sm mb-4 uppercase">
                                5 Free Downloads Added
                            </div>
                            <p className="text-slate-500 font-medium mb-1">Your reward has been applied to your account.</p>
                            <p className="text-slate-400 text-xs italic">Closing in 3 seconds...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}