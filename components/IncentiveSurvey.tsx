"use client";

import React, { useState } from 'react';
import { Sparkles, Trophy, X, Send, CheckCircle2 } from 'lucide-react';

interface IncentiveSurveyProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<boolean>;
}

const IncentiveSurvey: React.FC<IncentiveSurveyProps> = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState<'survey' | 'success'>('survey');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questions = [
        {
            id: 'intent',
            question: 'What is your main goal for this video?',
            options: [
                { label: 'Secondary creation (Re-edit)', value: 'edit' },
                { label: 'Learning / Research', value: 'study' },
                { label: 'Personal Storage', value: 'archive' },
                { label: 'Content Strategy Analysis', value: 'viral' }
            ]
        },
        {
            id: 'frequency',
            question: 'How often do you download Shorts?',
            options: [
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Occasionally', value: 'rarely' }
            ]
        }
    ];

    const handleOptionSelect = (qId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const success = await onSubmit(answers);
        if (success) {
            setStep('success');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-full max-w-sm animate-in slide-in-from-right-10 duration-500">
            <div className="bg-white rounded-[32px] shadow-2xl shadow-red-200/50 border border-red-100 overflow-hidden ring-1 ring-black/5">
                {step === 'survey' ? (
                    <div className="p-8">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
                                <Sparkles size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">想要更多额度？</h4>
                                <p className="text-[10px] text-red-600 font-black uppercase mt-1 tracking-widest">Bonus Quota Available</p>
                            </div>
                        </div>

                        <p className="text-slate-600 font-bold text-xs mb-8 leading-relaxed">
                            花费 30 秒告诉我们你的建议，<br />
                            立即赠送 <span className="text-red-600 font-black text-sm">5 个</span> 下载配额！
                        </p>

                        <div className="space-y-6 mb-8">
                            {questions.map((q) => (
                                <div key={q.id}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{q.question}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {q.options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleOptionSelect(q.id, opt.value)}
                                                className={`px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border ${answers[q.id] === opt.value ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white hover:border-slate-200'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Anything else we could do?</p>
                                <textarea
                                    placeholder="Your suggestions (Optional)..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium outline-none focus:bg-white focus:border-red-200 transition-all resize-none h-20"
                                    onChange={(e) => setAnswers(prev => ({ ...prev, suggestion: e.target.value }))}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || Object.keys(answers).length < questions.length}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-100 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                        >
                            {isSubmitting ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} strokeWidth={3} />}
                            <span>Submit & Get +5 Quota</span>
                        </button>
                    </div>
                ) : (
                    <div className="p-10 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6 shadow-lg shadow-green-50">
                            <Trophy size={40} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">领取成功！</h4>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">
                            感谢您的建议！<br />
                            <span className="text-green-600">5 个额外下载配额</span> 已充值到您的账户。
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <CheckCircle2 size={18} strokeWidth={3} />
                            <span>继续使用</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncentiveSurvey;
