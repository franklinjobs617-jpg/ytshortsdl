"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // 💡 Sanitize Client ID: Remove quotes if they exist in the env var
    let clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";
    clientId = clientId.replace(/^"|"$/g, '').trim();

    const paypalOptions = {
        clientId: clientId,
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            {children}
        </PayPalScriptProvider>
    );
}
