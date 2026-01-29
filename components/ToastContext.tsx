"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Check } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'error') => {
        let finalMessage = message;

        // 统一处理 500 错误或包含 "500" 的消息
        if (type === 'error' && (message.includes('500') || message.toLowerCase().includes('internal server error'))) {
            finalMessage = "There are some issues, Try again !";
        }

        const id = Date.now();
        setToasts((prev) => [...prev, { id, message: finalMessage, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none w-xs md:w-lg max-sm px-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-slate-900' : 'bg-green-600'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto mb-3 border border-white/10 w-full`}>
                        <span className={toast.type === 'error' ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                            {toast.type === 'error' ? <span className="text-xl">●</span> : <Check size={18} strokeWidth={4} />}
                        </span>
                        <span className="font-bold text-xs">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
