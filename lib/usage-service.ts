// lib/usage-service.ts
import { prisma } from './prisma';
import { PLAN_LIMITS } from './limits';

export async function getOrCreateUsage(userId?: number, guestId?: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 查找条件：登录用户用 userId，游客用 guestId
    const where = userId ? { userId } : { guestId };
    
    let usage = await prisma.usage.findFirst({ where });

    // 如果不存在，或者跨月了，则初始化/重置
    if (!usage || usage.lastResetMonth !== currentMonth || usage.lastResetYear !== currentYear) {
        const resetData = {
            lastResetMonth: currentMonth,
            lastResetYear: currentYear,
            downloadCount: 0,
            extractionCount: 0,
            summaryCount: 0,
            plan: usage?.plan || "FREE",
            expireTime: usage?.expireTime || null,
            userId,
            guestId
        };

        if (usage) {
            usage = await prisma.usage.update({ where: { id: usage.id }, data: resetData });
        } else {
            usage = await prisma.usage.create({ data: resetData });
        }
    }

    // 检查订阅是否过期 (到期自动降级为 FREE)
    if (usage.expireTime && usage.expireTime < now && usage.plan !== "FREE") {
        usage = await prisma.usage.update({
            where: { id: usage.id },
            data: { plan: "FREE" }
        });
    }

    return usage;
}

export async function checkAndIncrement(
    type: 'download' | 'extract' | 'summary',
    userId?: number,
    guestId?: string
) {
    const usage = await getOrCreateUsage(userId, guestId);
    const plan = usage.plan as keyof typeof PLAN_LIMITS;
    const limit = PLAN_LIMITS[plan];

    let currentCount = 0;
    let field = "";

    if (type === 'download') { field = "downloadCount"; currentCount = usage.downloadCount; }
    else if (type === 'extract') { field = "extractionCount"; currentCount = usage.extractionCount; }
    else if (type === 'summary') { field = "summaryCount"; currentCount = usage.summaryCount; }

    const max = limit[type];

    if (currentCount >= max) {
        return { allowed: false, usage };
    }

    // 增加计数
    const updatedUsage = await prisma.usage.update({
        where: { id: usage.id },
        data: { [field]: currentCount + 1 }
    });

    return { allowed: true, usage: updatedUsage };
}