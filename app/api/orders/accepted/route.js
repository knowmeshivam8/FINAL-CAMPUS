import { connectDB } from '../../../../lib/db'
import Order from '../../../../models/order'
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')
    await connectDB()
    const orders = await Order.find({ deliveryPartner: phone, status: { $in: ["ACCEPTED", "PICKED_UP"] } })
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}