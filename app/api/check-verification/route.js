import { connectDB } from '../../../lib/db'
import User from '../../../models/user'
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { phone } = await req.json()
    await connectDB()

    const user = await User.findById(phone)
    if (!user) return NextResponse.json({ verified: false }, { status: 404 })

    return NextResponse.json({ verified: user.verified })
  } catch (e) {
    return NextResponse.json({ verified: false }, { status: 500 })
  }
}