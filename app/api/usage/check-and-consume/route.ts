import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUsage } from '@/lib/usage-service';
import { prisma } from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/limits';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, guestId, type, action } = body; 
        // type: 'download' | 'extract' | 'summary'
        // action: 'check' | 'consume' | undefined (不传则走原有逻辑)

        const usage = await getOrCreateUsage(
            userId ? parseInt(userId) : undefined,
            guestId
        );

        const plan = (usage.plan || "FREE") as keyof typeof PLAN_LIMITS;
        const limits = PLAN_LIMITS[plan];

        // 映射字段名
        const fieldMap = {
            download: "downloadCount",
            extract: "extractionCount",
            summary: "summaryCount"
        };
        const field = fieldMap[type as keyof typeof fieldMap] as "downloadCount" | "extractionCount" | "summaryCount";
        const currentCount = usage[field];
        const maxLimit = limits[type as 'download' | 'extract' | 'summary'] as number;

        // ==========================================================
        // 分支 1: 纯检查逻辑 (action === 'check')
        // ==========================================================
        if (action === 'check') {
            return NextResponse.json({ 
                allowed: currentCount < maxLimit, 
                usage 
            });
        }

        // ==========================================================
        // 分支 2: 纯扣费逻辑 (action === 'consume')
        // ==========================================================
        if (action === 'consume') {
            const updatedUsage = await prisma.usage.update({
                where: { id: usage.id },
                data: { [field]: { increment: 1 } }
            });
            return NextResponse.json({ success: true, usage: updatedUsage });
        }

        // ==========================================================
        // 分支 3: 原有逻辑 - 查询并立即扣费
        // ==========================================================
        if (currentCount >= maxLimit) {
            return NextResponse.json({ allowed: false, reason: "limit_reached" }, { status: 403 });
        }

        const updatedUsage = await prisma.usage.update({
            where: { id: usage.id },
            data: { [field]: { increment: 1 } }
        });

        return NextResponse.json({ allowed: true, usage: updatedUsage });

    } catch (error: any) {
        console.error("Usage API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}