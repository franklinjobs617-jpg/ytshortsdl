import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAndIncrement } from '@/lib/usage-service';

export async function POST(req: NextRequest) {
    try {
        const { email, userId, type = 'download' } = await req.json();

        const consumeType = (type || 'download') as 'download' | 'extract' | 'summary';
        if (!['download', 'extract', 'summary'].includes(consumeType)) {
            return NextResponse.json({ error: 'Invalid consume type' }, { status: 400 });
        }

        let resolvedUserId: number | undefined = userId;
        if (!resolvedUserId && email) {
            const user = await prisma.user.findUnique({ where: { email } });
            resolvedUserId = user?.id;
        }

        if (!resolvedUserId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const result = await checkAndIncrement(consumeType, resolvedUserId);
        if (!result.allowed) {
            return NextResponse.json(
                { error: 'Quota exceeded', allowed: false, usage: result.usage },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, allowed: true, usage: result.usage });
    } catch {
        return NextResponse.json({ error: 'Server error, try later' }, { status: 500 });
    }
}
