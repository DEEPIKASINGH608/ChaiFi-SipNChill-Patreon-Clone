import { NextResponse } from "next/server";
import { validatePayment } from "../../../lib/razorpay";
import Payment from "../../../models/Payment";
import Razorpay from "razorpay";
import connectDB from "../../../utils/connectDB";

export async function POST(req) {
    await connectDB();

    let body = await req.formData();
    body = Object.fromEntries(body);

    let p = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ success: false, message: "Order ID not found in database" });
    }

    const isValid = validatePayment(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature
    );

    if (isValid) {
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: true },
            { new: true }
        );

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_username}?paymentdone=true`);

    } else {
        return NextResponse.json({ success: false, message: "Payment Verification Failed" });
    }
}


