// app/api/usage/survey-submit/route.ts

import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { userId, surveyData } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. 检查是否已提交过（防止刷奖）
        const existing = await prisma.survey.findUnique({
            where: { userId: Number(userId) }
        });

        if (existing) {
            return NextResponse.json({ error: "Survey already completed" }, { status: 400 });
        }

        const REWARD_DOWNLOADS = 5;

        // 2. 开启事务：保存数据 + 返还配额
        const result = await prisma.$transaction(async (tx) => {
            // A. 保存精细化的问卷结果
            await tx.survey.create({
                data: {
                    userId: Number(userId),
                    purpose: surveyData.purpose,
                    improvement: surveyData.improvement,
                    payingFeature: surveyData.payingFeature,
                    feedback: surveyData.feedback
                }
            });

            // B. 操作 Usage 表：减少已下载计数 (等于增加剩余额度)
            const currentUsage = await tx.usage.findUnique({
                where: { userId: Number(userId) }
            });

            if (!currentUsage) {
                throw new Error("Usage record not found");
            }

            const updatedUsage = await tx.usage.update({
                where: { userId: Number(userId) },
                data: {
                    // 将已使用次数减去 5
                    downloadCount: {
                        decrement: REWARD_DOWNLOADS
                    }
                }
            });

            return updatedUsage;
        });

        return NextResponse.json({ 
            success: true, 
            usage: result,
            message: `Survey submitted! ${REWARD_DOWNLOADS} Free Downloads added.` 
        });

    } catch (error: any) {
        console.error("Survey Reward Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}