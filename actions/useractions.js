"use server"

import Razorpay from "razorpay";
import Payment from "../models/Payment";
import connectDB from "../utils/connectDB";
import User from "../models/User";

export const initiate = async (amount, to_username, paymentformData) => {
    await connectDB()

    let options = {
        amount: Number.parseInt(amount) * 100,
        currency: "INR",

    }
    let x = await instance.orders.create(options)

    //create a payment object which shows pending payment in the database-
    await Payment.create({
        oid: x.id,
        amount: amount,
        to_username: to_username,
        name: paymentformData.name,
        message: paymentformData.message
    })
    return x
}