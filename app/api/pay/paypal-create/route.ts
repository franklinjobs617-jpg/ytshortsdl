// app/api/pay/paypal-create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, email, userId } = await req.json();

        // --- 1. 套餐逻辑判断 (与 Stripe 保持同步) ---
        let planName = "";
        let creditAmount = "";
        let amountValue = "";

        switch (type) {
            case "plan_pro_monthly":
                planName = "Pro Plan (Monthly)";
                creditAmount = "300";
                amountValue = "12.90";
                break;
            case "plan_pro_yearly":
                planName = "Pro Plan (Yearly)";
                creditAmount = "300";
                amountValue = "99.00";
                break;
            case "plan_elite_monthly":
                planName = "Elite Plan (Monthly)";
                creditAmount = "Unlimited";
                amountValue = "29.90";
                break;
            case "plan_elite_yearly":
                planName = "Elite Plan (Yearly)";
                creditAmount = "Unlimited";
                amountValue = "199.00";
                break;
            default:
                return NextResponse.json({ error: "Invalid Plan Type" }, { status: 400 });
        }
 

        // --- 3. 请求第三方 PayPal 接口获取支付链接 ---
        // 注意：这里请求的是 paypal 专用的 getPayUrl 接口
        const paypalRes = await fetch('https://api.ytshortsdl.net/prod-api/paypal/createOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                googleUserId: googleUserId, 
                type: type, // 传给第三方的原始类型
                project: "ytshorts"
            }), 
        });
        

        if (!paypalRes.ok) {
            const errorText = await paypalRes.text();
            console.error('❌ PayPal API 响应异常:', errorText);
            throw new Error(`PayPal Gateway Error: ${paypalRes.status}`);
        }

        const resData = await paypalRes.json();
        // 接口通常返回格式为 { code: 0, data: "https://www.paypal.com/..." }
        const checkoutUrl = resData.data || resData.url;

        if (!checkoutUrl) throw new Error("No PayPal URL returned from gateway");

        // --- 4. 存入数据库 Pay 表记录 ---
        const order = await prisma.pay.create({
            data: {
                userId: userId,
                googleUserId: googleUserId,
                email: email,
                orderNo: `PP_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // PP 前缀代表 PayPal
                checkoutUrl: checkoutUrl,
                status: "1",      // 1. 待支付
                type: type,        
                businessType: "4", // 4 代表 PayPal 业务
                amount: amountValue,
                remark: `PayPal | Plan: ${planName} | Credits: ${creditAmount}`,
                timestamp: Date.now().toString(),
                ip: req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
            }   
        });

        console.log(`✅ PayPal 订单已入库，ID: ${order.id}`);

        return NextResponse.json({ 
            status: "success", 
            url: checkoutUrl, 
            orderId: order.id 
        });

    } catch (error: any) {
        console.error("❌ PayPal 支付创建失败:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}