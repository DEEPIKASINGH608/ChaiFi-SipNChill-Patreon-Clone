"use server"

import Razorpay from "razorpay"
import connectDb from "@/db/connectDb"
import Payment from "@/models/Payment"
import User from "@/models/User"
import { instance } from './razorpay';

export const initiate = async (amount, username, paymentformData) => {

    await connectDb();

    let user = await User.findOne({ username: username });

    const razorpayKeyId = user?.razorpayid || process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = user?.razorpaysecret || process.env.RAZORPAY_KEY_SECRET;


    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    let options = {
        amount: Number(amount) * 100,
        currency: "INR",
    }

    let order = await instance.orders.create(options)

    await Payment.create({
        name: paymentformData.name || "Anonymous",
        to_user: username,
        oid: order.id,
        amount: amount,
        message: paymentformData.message || "",
        done: false
    });

    return JSON.parse(JSON.stringify(order));
}
