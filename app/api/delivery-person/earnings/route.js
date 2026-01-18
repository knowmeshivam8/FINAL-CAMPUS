import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import UserSchema from "@/models/user";
import OrderSchema from "@/models/order";

export async function POST(req) {
    try {
        await connectDB();

        const { phone } = await req.json();
        const user = await UserSchema.findOne({ phone });

        if (!user) {
            return NextResponse.json({ success: false, message: "delivery partner with this number doesn't exist" }, { status: 404 });
        }

        if (user.verified !== true) {
            return NextResponse.json({ success: false, message: "user is not verified" }, { status: 400 });
        }

        const orders = await OrderSchema.find({
            deliveryPartner: user.phone
        });

        const totalEarnings = orders.reduce((prev, curr) => {
            return prev + curr.deliveryFee
        }, 0)

        return NextResponse.json({ success: true, message: "Total earnings", totalEarnings }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}