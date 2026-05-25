import { NextResponse } from "next/server";
import { validatePayment } from "@/lib/razorpay";
import Payment from "@/models/payment";
import Razorpay from "razorpay";
import connectDB from "@/utils/connectDB";

export async function POST(request) {
    await connectDB();
    let body = await request.json();
    body = object.fromEntries(body);


    //check if razorpayid is present on the server
    let p = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    //verify the payment

    let xx = validatePaymentverification("razorpay_order_id": body.razorpay_order_id);
}