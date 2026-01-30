// app/api/usage/survey-submit/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
    try {
        const { userId, surveyData } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. 检查该用户是否已经提交过问卷
        const existingSurvey = await prisma.survey.findUnique({
            where: { userId: Number(userId) }
        });

        if (existingSurvey) {
            return NextResponse.json({ error: "Survey already submitted" }, { status: 400 });
        }

        // 2. 使用事务处理：保存问卷内容 + 赠送积分
        // 我们假设赠送 10 个 Credits
        const REWARD_POINTS = 10;

        const result = await prisma.$transaction(async (tx) => {
            // A. 创建问卷记录
            await tx.survey.create({
                data: {
                    userId: Number(userId),
                    purpose: surveyData.purpose,
                    source: surveyData.source,
                    rating: surveyData.rating
                }
            });

            // B. 更新 User 表中的 credits (字符串存储需转换)
            const user = await tx.user.findUnique({ where: { id: Number(userId) } });
            const currentCredits = parseInt(user?.credits || "0", 10);
            const newCredits = (currentCredits + REWARD_POINTS).toString();

            const updatedUser = await tx.user.update({
                where: { id: Number(userId) },
                data: { credits: newCredits }
            });

            // C. 返回最新的用法数据 (同步给前端)
            const usage = await tx.usage.findUnique({
                where: { userId: Number(userId) }
            });

            return { usage, credits: updatedUser.credits };
        });

        return NextResponse.json({ 
            success: true, 
            usage: result.usage,
            newCredits: result.credits,
            message: `Success! +${REWARD_POINTS} credits added.` 
        });

    } catch (error: any) {
        console.error("Survey Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}