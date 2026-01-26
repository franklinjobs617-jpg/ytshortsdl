import { Metadata } from 'next';
import PaypalStatus from '@/components/PaypalStatus';

export const metadata: Metadata = {
    title: 'Verifying Payment | YTShortsDL.net',
    description: 'Please wait while we verify your PayPal payment and upgrade your account.',
    alternates: {
        canonical: 'https://ytshortsdl.net/paypalpayment',
    },
    robots: {
        index: false, // 回调页不需要被搜索引擎索引
    }
};

export default function PaypalPaymentPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <PaypalStatus />
        </main>
    );
}