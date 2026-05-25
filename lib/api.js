"use server"

import Razorpay from "razorpay"

export const initiate = async (amount, username, paymentformData) => {

    // Initialize Razorpay instance
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    // Create a new order object for your sub-units (paise)
    let options = {
        amount: Number(amount) * 100, // Converts rupees to paise
        currency: "INR",
    }

    let x = await instance.orders.create(options)
    return x;
}

