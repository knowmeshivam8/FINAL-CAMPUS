
import { NextResponse, NextRequest } from "next/server";
import OrderSchema from "@/models/order"
import UserSchema from "@/models/user.js"
import webpush from "web-push";
/**
 * 
 * @param {NextRequest} req 
 * @returns {NextResponse}
 */


export async function POST(req) {
    try {

        const formData = await req.formData();
        const status = formData.get('status');
        const txnid = formData.get('txnid');
        const firstname = formData.get('firstname');
        const amount = formData.get('amount');

        const url = new URL(`${process.env.NEXT_PUBLIC_DOMAIN}/receipt?orderId=${txnid}&status=${status}`, req.url);

        if (status !== "success") {
            return NextResponse.redirect(url, 303);
        }

        const fetchOrder = await OrderSchema.findById(txnid);

        if (!fetchOrder) {
            return NextResponse.json({ success: false, message: "NO Order with this Txnid: " + txnid });
        }

        fetchOrder.status = "PAID";

        await fetchOrder.save();

        const deliveryRiders = await UserSchema.find({
            subscription: {
                $exists: true
            }
        });

        if (deliveryRiders.length !== 0) {

            webpush.setVapidDetails(
                'mailto:mail@example.com',
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY,
            );
            const notification = JSON.stringify({
                title: "New Order",
                body: `${firstname} has ordered new items worth of ${amount}`,
                url: process.env.DELIVERY_PAGE,
            });

            const notificationSended = deliveryRiders.map(async (rider) => {
                webpush.sendNotification(rider.subscription, notification);
            })

            await Promise.all(notificationSended);
        }

        return NextResponse.redirect(url, 303);

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
