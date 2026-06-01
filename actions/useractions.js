"use server"

import Razorpay from "razorpay";
import Payment from "../models/Payment";
import connectDB from "../db/connectDb";
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
    try {
        let x = await instance.orders.create(options)

        await Payment.create({
            oid: x.id,
            amount: amount,
            to_user: username,
            name: paymentformData.name,
            message: paymentformData.message
        });

        return x
    } catch (error) {
        console.error("Error initiating payment:", error);
        throw new Error("Failed to initiate payment");
    }
}

export const fetchuser = async (username) => {
    await connectDB()
    let u = await User.findOne({ username: username })
    if (!u) return null; // Safety check in case user doesn't exist

    // Converts the Mongoose document into a plain, perfectly serializable object
    let user = JSON.parse(JSON.stringify(u))

    return user
}

export const fetchpayments = async (username) => {
    await connectDB()
    let p = await Payment.find({ to_user: username }).sort({ amount: -1 }).lean()

    // Safely turn ObjectIds and Dates into clean, simple text strings
    return JSON.parse(JSON.stringify(p))
}

export const updateProfile = async (data, oldusername) => {
    await connectDB()
    let ndata = Object.fromEntries(data)

    if(oldusername !== ndata.username){
    let u = await username.findOne({username: ndata.username})
    if(u){
        return {error: "Username already exists."}
    }
  }
  await username.updateOne({email: ndata.email}, ndata)
}