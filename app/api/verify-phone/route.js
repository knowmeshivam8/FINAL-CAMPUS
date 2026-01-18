import { connectDB } from "../../../lib/db";
import User from "../../../models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_json_url } = await req.json();

    if (!user_json_url?.startsWith("https://user.phone.email/")) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const res = await fetch(user_json_url);
    const data = await res.json();

    const phone = `${data.user_country_code}${data.user_phone_number}`;

    // ✅ VERIFIED phone number
    console.log("Verified Phone:", phone);

    // Save user if not exists
    await connectDB();
    await User.findByIdAndUpdate(phone, { phone }, { upsert: true });

    return NextResponse.json({
      success: true,
      phone,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
