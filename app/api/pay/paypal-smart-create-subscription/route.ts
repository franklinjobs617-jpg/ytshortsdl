import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. 获取前端传来的参数 (type, googleUserId, email 等)
    const body = await request.json();

    const javaBackendUrl = "https://api.connectthedotsprintable.online/prod-api/paypal/smart/create-subscription";

    const response = await fetch(javaBackendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error creating PayPal subscription proxy:", error);
    return NextResponse.json(
      { code: 500, msg: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
}