import { Metadata } from 'next';
import PaypalStatus from '@/components/PaypalStatus';
import { Suspense } from 'react'; // 🚀 必须引入

export const metadata: Metadata = {
    title: 'Verifying Payment | YTShortsDL.net',
    description: 'Please wait while we verify your PayPal payment and upgrade your account.',
    metadataBase: new URL('https://ytshortsdl.net'), // 修复 metadataBase 警告
    alternates: {
        canonical: 'https://ytshortsdl.net/paypalpayment',
    },
    robots: {
        index: false,
    }
};

export default function PaypalPaymentPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* 🚀 核心修复：使用 useSearchParams 的组件必须包裹在 Suspense 中 */}
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Initializing...</p>
                </div>
            }>
                <PaypalStatus />
            </Suspense>
        </main>
    );
}