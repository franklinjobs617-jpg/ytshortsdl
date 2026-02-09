// app/api/pay/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, email, userId } = await req.json();

        // --- 1. 根据 type 进行业务逻辑判断 ---
        let planName = "";
        let stripePriceId = "";
        let creditAmount = "0";
        let amountValue = "0.00";

        switch (type) {
            // ============ Pro Plan ============
            case "plan_pro_monthly":
                planName = "Pro Plan (Monthly)";
                stripePriceId = "price_1SsagwDPlpaTncfejeAz5NJb";
                creditAmount = "300";
                amountValue = "12.90";
                break;
            case "plan_pro_yearly":
                planName = "Pro Plan (Yearly)";
                stripePriceId = "price_1SsahWDPlpaTncfedqPU9Pz0";
                creditAmount = "300";
                amountValue = "99.00";
                break;

            // ============ Elite Plan ============
            case "plan_elite_monthly":
                planName = "Elite Plan (Monthly)";
                stripePriceId = "price_1SsahyDPlpaTncfeAw1mAlg0";
                creditAmount = "Unlimited";
                amountValue = "29.90";
                break;
            case "plan_elite_yearly":
                planName = "Elite Plan (Yearly)";
                stripePriceId = "price_1SsaiGDPlpaTncfeSXhfuE9T";
                creditAmount = "Unlimited";
                amountValue = "199.00";
                break;
            
            default:
                return NextResponse.json({ error: "Invalid Plan Type" }, { status: 400 });
        }

        
        // --- 3. 请求第三方支付接口获取真正的支付链接 ---
        const stripeRes = await fetch('https://api.ytshortsdl.net/prod-api/stripe/getPayUrl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                googleUserId: googleUserId, 
                type: type, // 传给第三方的原始类型
                project: "ytshorts"
            }), 
        });

        if (!stripeRes.ok) {
            const errorText = await stripeRes.text();
            console.error('❌ 第三方接口报错:', errorText);
            throw new Error(`Payment Gateway Error: ${stripeRes.status}`);
        }

        const resData = await stripeRes.json();
        const checkoutUrl = resData.data || resData.url;

        if (!checkoutUrl) throw new Error("No URL returned from gateway");

        // --- 4. 存入数据库 Pay 表 ---
        const order = await prisma.pay.create({
            data: {
                userId: userId,
                googleUserId: googleUserId,
                email: email,
                orderNo: `YT_${Date.now()}`, // 生成唯一内部订单号
                checkoutUrl: checkoutUrl,
                status: "1",      // 1. 待支付
                type: type,        // 原始类型字符串
                businessType: "ytshorts", // 代表 Stripe 业务
                amount: amountValue,
                // 在备注里记录套餐详细信息，方便人工对账
                remark: `Plan: ${planName} | PriceID: ${stripePriceId} | Credits: ${creditAmount}`,
                timestamp: Date.now().toString()
            }
        });

        console.log(`✅ 订单已入库，ID: ${order.id}，正在返回跳转链接`);

        return NextResponse.json({ 
            status: "success", 
            url: checkoutUrl, 
            orderId: order.id 
        });

    } catch (error: any) {
        console.error("❌ 支付创建流程崩溃:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}