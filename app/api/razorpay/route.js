import { NextResponse } from "next/server";
import { validatePayment } from "../../../lib/razorpay";
import Payment from "../../../models/Payment";
import Razorpay from "razorpay";
import connectDB from "../../../db/connectDb";
import User from "../../../models/User";

export async function POST(req) {
    await connectDB();

    let body = await req.formData();
    body = Object.fromEntries(body);

    let p = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ success: false, message: "Order ID not found in database" });
    }

    let user = await User.findOne({ username: p.to_user });
    const secret = user.razorpaysecret;

    const isValid = validatePayment(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
        secret
    );

    if (isValid) {
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: true },
            { returnDocument: 'after' }
        );

        console.log("RAZORPAY CALLBACK DEBUG");
        console.log("Updated Payment Document from DB:", updatedPayment);
        console.log("===========");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`);

    } else {
        return NextResponse.json({ success: false, message: "Payment Verification Failed" });
    }
}

