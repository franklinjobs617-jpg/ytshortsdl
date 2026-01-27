// lib/usage-service.ts
import { prisma } from './prisma';
import { PLAN_LIMITS } from './limits';

/**
 * 获取或创建使用记录 (支持每日重置和新用户奖励)
 */
export async function getOrCreateUsage(userId?: number, guestId?: string) {
    const now = new Date();
    // 获取当前日期字符串，例如 "2026-01-26"
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 查找条件
    const where = userId ? { userId } : { guestId };
    
    let usage = await prisma.usage.findFirst({ where });

    // --- 逻辑 1: 如果不存在记录 (新用户或新游客) ---
    if (!usage) {
        // 初始值设定：如果是登录用户，设为 -1 (配合 Limit 1 实现首登送 2 次)
        // 如果是游客，设为 0 (实现每日送 1 次)
        const initialVal = userId ? -1 : 0;

        return await prisma.usage.create({
            data: {
                userId,
                guestId,
                lastResetDate: todayStr,
                lastResetMonth: currentMonth,
                lastResetYear: currentYear,
                downloadCount: initialVal,
                extractionCount: initialVal,
                summaryCount: initialVal,
                plan: "FREE",
            }
        });
    }

    // --- 逻辑 2: 跨天自动重置 ---
    if (usage.lastResetDate !== todayStr) {
        usage = await prisma.usage.update({
            where: { id: usage.id },
            data: {
                lastResetDate: todayStr,
                lastResetMonth: currentMonth,
                lastResetYear: currentYear,
                downloadCount: 0, // 每天重置为 0，配合 Limit 1 实现每日 1 次
                extractionCount: 0,
                summaryCount: 0,
            }
        });
    }

    // --- 逻辑 3: 检查订阅是否过期 (到期自动降级为 FREE) ---
    if (usage.expireTime && usage.expireTime < now && usage.plan !== "FREE") {
        usage = await prisma.usage.update({
            where: { id: usage.id },
            data: { plan: "FREE" }
        });
    }

    return usage;
}

/**
 * 校验额度并自增
 * @param type 'download' | 'extract' | 'summary'
 */
export async function checkAndIncrement(
    type: 'download' | 'extract' | 'summary',
    userId?: number,
    guestId?: string
) {
    // 获取最新的使用情况 (内部已包含重置逻辑)
    const usage = await getOrCreateUsage(userId, guestId);
    
    const plan = (usage.plan || "FREE") as keyof typeof PLAN_LIMITS;
    const limits = PLAN_LIMITS[plan];

    let currentCount = 0;
    let field: "downloadCount" | "extractionCount" | "summaryCount";

    // 映射对应字段
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

    const maxLimit = limits[type];

    // 校验：如果当前已用次数 >= 最大限制
    if (currentCount >= maxLimit) {
        return { allowed: false, usage };
    }

    // 校验通过，增加计数
    const updatedUsage = await prisma.usage.update({
        where: { id: usage.id },
        data: { [field]: currentCount + 1 }
    });

    return { allowed: true, usage: updatedUsage };
}

/**
 * 仅检查：判断用户当前是否还有配额
 */
export async function isQuotaAvailable(
    type: 'download' | 'extract' | 'summary',
    userId?: number,
    guestId?: string
) {
    const usage = await getOrCreateUsage(userId, guestId);
    const plan = (usage.plan || "FREE") as keyof typeof PLAN_LIMITS;
    const limits = PLAN_LIMITS[plan];

    let currentCount = 0;
    if (type === 'download') currentCount = usage.downloadCount;
    else if (type === 'extract') currentCount = usage.extractionCount;
    else currentCount = usage.summaryCount;

    const maxLimit = limits[type];
    
    // 返回是否允许（已用 < 上限）
    return { allowed: currentCount < maxLimit, usage };
}

/**
 * 仅扣费：直接增加计数器
 */
export async function incrementUsageCount(
    type: 'download' | 'extract' | 'summary',
    userId?: number,
    guestId?: string
) {
    const usage = await getOrCreateUsage(userId, guestId);
    
    const fieldMap = {
        download: "downloadCount",
        extract: "extractionCount",
        summary: "summaryCount"
    };

    const updatedUsage = await prisma.usage.update({
        where: { id: usage.id },
        data: { [fieldMap[type]]: { increment: 1 } }
    });

    return updatedUsage;
}