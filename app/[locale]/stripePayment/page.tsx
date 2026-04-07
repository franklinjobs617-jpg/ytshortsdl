import { Metadata } from 'next';
import { Suspense } from 'react';
import StripeStatus from '@/components/StripeStatus';

export const metadata: Metadata = {
    title: 'Verifying Stripe Payment | YTShortsDL.net',
    description: 'Please wait while we verify your Stripe payment and upgrade your account.',
    metadataBase: new URL('https://ytshortsdl.net'),
    alternates: {
        canonical: 'https://ytshortsdl.net/stripePayment',
    },
    robots: {
        index: false,
    }
};

export default function StripePaymentPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Suspense
                fallback={
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Initializing...</p>
                    </div>
                }
            >
                <StripeStatus />
            </Suspense>
        </main>
    );
}
