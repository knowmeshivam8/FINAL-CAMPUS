import { connectDB } from '../../../../lib/db'
import Order from '../../../../models/order'
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find({ status: "PAID" })
    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}