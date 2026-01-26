// app/api/usage/get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUsage } from '@/lib/usage-service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, guestId } = body;

        // 调用刚才写的通用方法
        const usage = await getOrCreateUsage(
            userId ? parseInt(userId) : undefined, 
            guestId
        );

        return NextResponse.json(usage);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}