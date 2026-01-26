// app/api/usage/check-and-consume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUsage } from '@/lib/usage-service';
import { prisma } from '@/lib/prisma';

// 定义不同等级的上限
import { PLAN_LIMITS } from '@/lib/limits';


export async function POST(req: NextRequest) {
    try {
        const { userId, guestId, type } = await req.json(); // type: 'download' | 'extract' | 'summary'

        const usage = await getOrCreateUsage(
            userId ? parseInt(userId) : undefined, 
            guestId
        );

        const plan = usage.plan as keyof typeof PLAN_LIMITS;
const limits = PLAN_LIMITS[plan];
        
        // 确定要检查和增加的字段
        let field: "downloadCount" | "extractionCount" | "summaryCount";
        let currentCount = 0;

        if (type === 'download') {
            field = "downloadCount";
            currentCount = usage.downloadCount;
        } else if (type === 'extract') {
            field = "extractionCount";
            currentCount = usage.extractionCount;
        } else {
            field = "summaryCount";
            currentCount = usage.summaryCount;
        }

       const maxLimit = limits[type as 'download' | 'extract' | 'summary'] as number;

        // 校验额度
        if (currentCount >= maxLimit) {
            return NextResponse.json({ allowed: false, reason: "limit_reached" }, { status: 403 });
        }

        // 额度足够，执行扣费（计数器+1）
        const updatedUsage = await prisma.usage.update({
            where: { id: usage.id },
            data: { [field]: { increment: 1 } }
        });

        return NextResponse.json({ allowed: true, usage: updatedUsage });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}