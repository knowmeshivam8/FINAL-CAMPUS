import webpush from "web-push";
import UserSchema from "@/models/user.js";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        webpush.setVapidDetails(
            'mailto:mail@example.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY,
        );

        const body = await request.json();
        const { phone, subscription } = body;
        // console.log(phone, subscription)
        const user = await UserSchema.findOneAndUpdate({ phone }, { subscription });
        if (!user) {
            return NextResponse.json({ success: false, message: 'user not found' }, { status: 404 })
        }


        return new Response(JSON.stringify({ message: 'Subscription set.' }), {});
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}
