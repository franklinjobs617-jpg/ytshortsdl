// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        // --- 1. 获取 Token ---
        const body = await req.json();
        const token = body.token || body.accessToken;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        console.log(`🚀 开始校验 Google Token...`);

        // --- 2. 请求 Google UserInfo 接口 ---
        // 注意：删除了 HttpsProxyAgent。Vercel 位于海外，可以直接连接 Google。
        // 本地开发如需代理，请在终端执行 set HTTPS_PROXY=http://127.0.0.1:7890 
        // 而不是在代码中注入 agent，否则部署到 Vercel 会因为找不到本地代理端口而报错。
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
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

        // --- 3. 执行业务逻辑 ---
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

            // 跨天补分逻辑
            if (lastActive < today && parseInt(user.credits || "0") === 0) {
                updateData.credits = "1";
            }

            user = await prisma.user.update({
                where: { email },
                data: updateData
            });
            console.log(`✅ 老用户登录: ${email}`);
        } else {
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
                id: user.id,
                googleUserId: user.googleUserId,
                email: user.email,
                name: user.name,
                picture: user.picture,
                credits: user.credits
            }
        });

    } catch (error: any) {
        console.error('❌ Server Login Error Detail:', error);

        // 针对网络问题的友好提示
        if (error.message.includes('fetch failed')) {
            return NextResponse.json({
                error: "Network error: Server cannot reach Google. If local, check your VPN. If on Vercel, check DATABASE_URL."
            }, { status: 500 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}