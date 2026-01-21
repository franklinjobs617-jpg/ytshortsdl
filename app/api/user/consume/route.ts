import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || parseInt(user.credits || "0") <= 0) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
        }
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { credits: (parseInt(user.credits || "0") - 1).toString() }
        });
        return NextResponse.json(updatedUser);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}