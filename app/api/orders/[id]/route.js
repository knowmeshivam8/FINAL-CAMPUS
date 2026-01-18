import { connectDB } from '../../../../lib/db'
import Order from '../../../../models/order'
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { id } = params
    await connectDB()

    const order = await Order.findById(id)
    if (!order) return NextResponse.json({ success: false }, { status: 404 })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}