"use server"

import Razorpay from "razorpay";
import Payment from "../models/Payment";
import connectDB from "../utils/connectDB";
import User from "../models/User";

export const initiate = async (amount, username, paymentformData) => {
    await connectDB()
    var instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let options = {
        amount: Number.parseInt(amount) * 100,
        currency: "INR",
    }

    let x = await instance.orders.create(options)

    await Payment.create({
        oid: x.id,
        amount: amount,
        to_username: username,
        name: paymentformData.name,
        message: paymentformData.message
    })

    return x
}



