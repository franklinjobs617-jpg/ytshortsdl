import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { googleUserId, type } = await req.json();

    let planName = "";
    let stripePriceId = "";

    switch (type) {
      case "plan_pro_monthly":
        planName = "Pro Plan (Monthly)";
        stripePriceId = "price_1SsagwDPlpaTncfejeAz5NJb";
        break;
      case "plan_pro_yearly":
        planName = "Pro Plan (Yearly)";
        stripePriceId = "price_1SsahWDPlpaTncfedqPU9Pz0";
        break;
      case "plan_elite_monthly":
        planName = "Elite Plan (Monthly)";
        stripePriceId = "price_1SsahyDPlpaTncfeAw1mAlg0";
        break;
      case "plan_elite_yearly":
        planName = "Elite Plan (Yearly)";
        stripePriceId = "price_1SsaiGDPlpaTncfeSXhfuE9T";
        break;
      default:
        return NextResponse.json({ error: "Invalid Plan Type" }, { status: 400 });
    }

    const stripeRes = await fetch("https://api.ytshortsdl.net/prod-api/stripe/getPayUrl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleUserId,
        type,
        project: "ytshorts",
      }),
    });

    if (!stripeRes.ok) {
      const errorText = await stripeRes.text();
      console.error("Stripe getPayUrl failed:", errorText);
      throw new Error(`Payment Gateway Error: ${stripeRes.status}`);
    }

    const resData = await stripeRes.json();
    const checkoutUrl = resData.data || resData.url;
    if (!checkoutUrl) throw new Error("No URL returned from gateway");

    console.log(`Stripe checkout url generated: plan=${planName}, priceId=${stripePriceId}`);

    return NextResponse.json({
      status: "success",
      url: checkoutUrl,
    });
  } catch (error: any) {
    console.error("Stripe create flow failed:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}
