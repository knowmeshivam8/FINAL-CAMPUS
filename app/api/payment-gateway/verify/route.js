import { NextResponse } from "next/server";
import { payuClient } from "../../../../lib/paymentGateway";

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    const paymentVerify = await payuClient.verifyPayment(orderId);

    return NextResponse.json({ success: true, paymentVerify });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
