import { connectDB } from '../../../../lib/db'
import Order from '../../../../models/order'
import { NextResponse } from "next/server"

export async function PUT(req) {
  try {
    const { orderId, status, deliveryPartner, otp } = await req.json()
    await connectDB()

    const update = { status }
    if (deliveryPartner) update.deliveryPartner = deliveryPartner

    if (status === "PICKED_UP") {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      update.otp = generatedOtp;
    }

    if (status === "DELIVERED") {
      const order = await Order.findById(orderId);
      if (!order || order.otp !== otp) {
        return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 })
      }
    }

    const order = await Order.findByIdAndUpdate(orderId, update, { new: true })
    if (!order) return NextResponse.json({ success: false }, { status: 404 })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}