import { connectDB } from '../../../lib/db'
import Order from '../../../models/order'
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const data = await req.json()
    await connectDB()

    // Validation
    if (!data.userId || !data.cart || data.cart.length === 0 || !data.name || !data.address) {
      return NextResponse.json({ success: false, error: 'Invalid order data' }, { status: 400 })
    }

    const order = await Order.create(data)
    return NextResponse.json({ success: true, orderId: order._id })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
