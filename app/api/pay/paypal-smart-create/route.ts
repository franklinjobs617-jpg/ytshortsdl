
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
        console.log(data)

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ Smart Create Error:", error.message);
        return NextResponse.json({ code: 500, msg: error.message }, { status: 500 });
    }
}
