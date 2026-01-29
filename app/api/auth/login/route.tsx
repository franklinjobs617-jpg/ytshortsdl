// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUsage } from '@/lib/usage-service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const token = body.token || body.accessToken;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // 1. 请求 Google UserInfo 接口
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!googleRes.ok) {
            return NextResponse.json({ error: 'Invalid Google Token' }, { status: 401 });
        }

        const payload = await googleRes.json();
        const email = payload.email;
        const now = new Date();
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // 2. 更新或创建用户基础信息
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                accessToken: token,
                ip: clientIp,
                updateTime: now,
                picture: payload.picture
            },
            create: {
                email,
                googleUserId: payload.sub,
                name: payload.name,
                givenName: payload.given_name,
                familyName: payload.family_name,
                picture: payload.picture,
                accessToken: token,
                ip: clientIp,
                type: "5",
                createTime: now,
                updateTime: now
            }
        });

        // 3. 🚀 核心逻辑：初始化或重置该用户的每日用量记录 (包含新用户送2分逻辑)
        const usage = await getOrCreateUsage(user.id);

        return NextResponse.json({
            status: "success",
            user: {
                id: user.id,
                googleUserId: user.googleUserId,
                email: user.email,
                name: user.name,
                picture: user.picture
            },
            usage: usage // 返回给前端最新的配额情况
        });

    } catch (error: any) {
        console.error('❌ Login Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}