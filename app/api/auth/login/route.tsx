// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function POST(req: NextRequest) {
    try {
        // --- 修复点 1：兼容前端可能传的不同字段名 ---
        const body = await req.json();
        const token = body.token || body.accessToken;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // --- 修复点 2：配置代理 ---
        // 请确保端口 7890 与你电脑上的加速器（Clash, V2Ray等）一致
        const proxyAddr = 'http://127.0.0.1:7890';
        const agent = process.env.NODE_ENV === 'development' ? new HttpsProxyAgent(proxyAddr) : undefined;

        console.log(`🚀 开始校验 Google Token...`);

        // 1. 请求 Google UserInfo 接口
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            // @ts-ignore - HttpsProxyAgent 在这里是合法的
            agent: agent
        });

        if (!googleRes.ok) {
            const errorText = await googleRes.text();
            console.error('❌ Google 校验返回错误:', errorText);
            return NextResponse.json({ error: 'Invalid Google Token' }, { status: 401 });
        }

        const payload = await googleRes.json();
        const email = payload.email;

        // 准备时间逻辑
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 获取用户 IP
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // --- 修复点 3：实现你的业务补分逻辑 ---
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // 老用户：检查是否跨天且积分为0，补到1分
            const lastActive = user.updateTime ? new Date(user.updateTime) : new Date(0);
            lastActive.setHours(0, 0, 0, 0);

            let updateData: any = {
                accessToken: token,
                ip: clientIp,
                updateTime: now,
                picture: payload.picture
            };

            if (lastActive < today && parseInt(user.credits || "0") === 0) {
                updateData.credits = "1";
            }

            user = await prisma.user.update({
                where: { email },
                data: updateData
            });
            console.log(`✅ 老用户登录: ${email}`);
        } else {
            // 新用户：初始赠送 3 分
            user = await prisma.user.create({
                data: {
                    email,
                    googleUserId: payload.sub,
                    name: payload.name,
                    givenName: payload.given_name,
                    familyName: payload.family_name,
                    picture: payload.picture,
                    credits: "0",
                    score: "3",
                    accessToken: token,
                    ip: clientIp,
                    type: "5", // ytshorts
                    createTime: now,
                    updateTime: now
                }
            });
            console.log(`✨ 新用户注册: ${email}`);
        }

        return NextResponse.json({
            status: "success",
            user: {
                email: user.email,
                name: user.name,
                picture: user.picture,
                credits: user.credits
            }
        });

    } catch (error: any) {
        // --- 修复点 4：更详细的错误打印 ---
        console.error('❌ Server Login Error Detail:', error);

        // 如果依然 fetch failed，通常是代理没开或者端口不对
        if (error.message.includes('fetch failed')) {
            return NextResponse.json({
                error: "Network error: Server cannot reach Google. Check your local Proxy/VPN."
            }, { status: 500 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}