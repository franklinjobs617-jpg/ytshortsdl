import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUsage } from '@/lib/usage-service';

function isPaidStatus(data: any) {
    const paidValues = new Set(['paid', 'success', 'succeeded', 'complete', 'completed']);
    const lower = (val: any) => (typeof val === 'string' ? val.toLowerCase() : '');
    const code = data?.code;
    const nestedCode = data?.data?.code;
    return (
        code === 0 ||
        code === 200 ||
        nestedCode === 0 ||
        nestedCode === 200 ||
        paidValues.has(lower(data?.data)) ||
        paidValues.has(lower(data?.data?.status)) ||
        paidValues.has(lower(data?.data?.paymentStatus)) ||
        paidValues.has(lower(data?.status)) ||
        paidValues.has(lower(data?.paymentStatus)) ||
        paidValues.has(lower(data?.payment_status))
    );
}

function resolvePlanFromType(type?: string | null): { plan: 'PRO' | 'ELITE'; months: number } | null {
    switch (type) {
        case 'plan_pro_monthly':
            return { plan: 'PRO', months: 1 };
        case 'plan_pro_yearly':
            return { plan: 'PRO', months: 12 };
        case 'plan_elite_monthly':
            return { plan: 'ELITE', months: 1 };
        case 'plan_elite_yearly':
            return { plan: 'ELITE', months: 12 };
        default:
            return null;
    }
}

function addMonthsToActiveExpiry(currentExpiry?: Date | null, months = 1) {
    const now = new Date();
    const base = currentExpiry && currentExpiry > now ? new Date(currentExpiry) : now;
    const next = new Date(base);
    next.setMonth(next.getMonth() + months);
    return next;
}

export async function GET(req: NextRequest) {
    try {
        const sessionId =
            req.nextUrl.searchParams.get('sessionId') ||
            req.nextUrl.searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json(
                { success: false, paid: false, message: 'sessionId is required' },
                { status: 400 }
            );
        }

        const upstreamRes = await fetch(
            `https://api.ytshortsdl.net/prod-api/stripe/check-order-status?sessionId=${encodeURIComponent(sessionId)}`,
            { method: 'GET', cache: 'no-store' }
        );

        let upstreamData: any = null;
        try {
            upstreamData = await upstreamRes.json();
        } catch {
            upstreamData = null;
        }

        if (!upstreamRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    paid: false,
                    message: `Upstream verification failed: ${upstreamRes.status}`,
                    upstream: upstreamData
                },
                { status: 502 }
            );
        }

        const paid = isPaidStatus(upstreamData);

        if (!paid) {
            return NextResponse.json({
                success: true,
                paid: false,
                updated: false,
                upstream: upstreamData
            });
        }

        const orderMatch = {
            OR: [
                { orderId: sessionId },
                { checkoutUrl: { contains: sessionId } },
                { orderResponse: { contains: sessionId } }
            ]
        };

        const matchedOrder = await prisma.pay.findFirst({
            where: orderMatch,
            orderBy: { id: 'desc' }
        });

        if (!matchedOrder) {
            return NextResponse.json({
                success: true,
                paid: true,
                updated: false,
                message: 'Payment confirmed but no matching local order found',
                upstream: upstreamData
            });
        }

        const shouldApplyEntitlement = matchedOrder.status !== '2';

        await prisma.pay.updateMany({
            where: {
                ...orderMatch,
                NOT: { status: '2' }
            },
            data: {
                status: '2',
                orderId: sessionId,
                orderResponse: JSON.stringify(upstreamData)
            }
        });

        const planMeta = resolvePlanFromType(matchedOrder.type);
        let userId = matchedOrder.userId ?? undefined;
        let updatedUsage: { plan?: string | null; expireTime?: Date | null } | null = null;

        if (!userId && matchedOrder.googleUserId) {
            const user = await prisma.user.findFirst({
                where: { googleUserId: matchedOrder.googleUserId }
            });
            userId = user?.id;
        }

        if (planMeta && userId && shouldApplyEntitlement) {
            const usage = await getOrCreateUsage(userId);
            const nextExpire = addMonthsToActiveExpiry(usage.expireTime, planMeta.months);

            updatedUsage = await prisma.usage.update({
                where: { id: usage.id },
                data: {
                    plan: planMeta.plan,
                    expireTime: nextExpire
                },
                select: {
                    plan: true,
                    expireTime: true
                }
            });
        }

        return NextResponse.json({
            success: true,
            paid,
            updated: true,
            orderDbId: matchedOrder.id,
            userId: userId ?? null,
            plan: updatedUsage?.plan ?? null,
            expireTime: updatedUsage?.expireTime ?? null,
            entitlementApplied: shouldApplyEntitlement,
            upstream: upstreamData
        });
    } catch (error: any) {
        console.error('Stripe status sync failed:', error?.message || error);
        return NextResponse.json(
            { success: false, paid: false, message: error?.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
