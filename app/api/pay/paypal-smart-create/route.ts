
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, email, userId } = await req.json();

        // Relay to Java Backend
        const backendRes = await fetch('https://api.ytshortsdl.net/prod-api/paypal/smart/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                googleUserId,
                type,
                project: "ytshorts"
            }),
        });

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            throw new Error(`Backend Error: ${backendRes.status} ${errorText}`);
        }

        const data = await backendRes.json();

        // Log locally for debugging/tracking
        try {
            await prisma.pay.create({
                data: {
                    userId: userId || "",
                    googleUserId: googleUserId || "",
                    email: email || "",
                    orderNo: `SMART_${Date.now()}`,
                    checkoutUrl: "SMART_BUTTON",
                    status: "1", // Pending
                    type: type,
                    businessType: "4", // PayPal
                    amount: "0.00", // We might not know exact amount here easily without parsing type map again, optional
                    remark: `Smart Button Init | ${data.data || 'No ID'}`,
                    timestamp: Date.now().toString(),
                    ip: req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
                }
            });
        } catch (e) {
            console.error("Failed to log smart order to local DB", e);
            // Non-blocking, continue
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ Smart Create Error:", error.message);
        return NextResponse.json({ code: 500, msg: error.message }, { status: 500 });
    }
}
