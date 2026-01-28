
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ code: 400, msg: "Order ID is required" }, { status: 400 });
        }

        const backendRes = await fetch('https://api.ytshortsdl.net/prod-api/paypal/smart/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });

        const data = await backendRes.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ Smart Capture Error:", error.message);
        return NextResponse.json({ code: 500, msg: error.message }, { status: 500 });
    }
}
