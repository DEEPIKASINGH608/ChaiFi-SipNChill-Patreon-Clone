"use server"

import Razorpay from "razorpay";
import Payment from "../models/Payment";
import connectDB from "@/db/connectDb";
import User from "@/models/User";
import Email from "next-auth/providers/email";

export const initiate = async (amount, to_username, paymentformData) => {
    await connectDB()
    let user = await User.findOne({ username: to_username });
    const secret = user.razorpaysecret;

    var instance = new Razorpay({
        key_id: user.razorpayid,
        key_secret: secret,
    });

    const amountInPaise = Number.parseInt(amount) * 100;

    let options = {
        amount: amountInPaise,
        currency: "INR",
    }
    try {
        let x = await instance.orders.create(options)

        await Payment.create({
            oid: x.id,
            amount: Number.parseInt(amount),
            to_user: to_username,
            name: paymentformData.name,
            message: paymentformData.message
        });

        return x
    } catch (error) {
        throw new Error("Failed to initiate payment");
    }
}

export const fetchuser = async (username) => {
    await connectDB()
    let u = await User.findOne({ username: username })
    if (!u) return null;
    let user = JSON.parse(JSON.stringify(u))
    return user
}

export const fetchpayments = async (username) => {
    await connectDB()
    let p = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).limit(10).lean()
    return JSON.parse(JSON.stringify(p))
}


export const updateProfile = async (oldusername, data) => {
    try {
        await connectDB();

        if (oldusername !== data.username) {
            const existingUser = await User.findOne({ username: data.username });
            if (existingUser) {
                return { success: false, message: "Username is already taken!" };
            }
                await Payment.updateMany({ to_user: oldusername }, { $set: { to_user: data.username } });
        }
        const updatedUser = await User.findOneAndUpdate(
            { username: oldusername },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return { success: false, message: "User profile not found in database." };
        }

        return {
            success: true,
            message: "Profile updated successfully!",
            user: JSON.parse(JSON.stringify(updatedUser))
        };

    } catch (error) {
         return {
            success: false,
            message: error.message || "Failed to update profile due to an internal server error."
        };
    }
}

