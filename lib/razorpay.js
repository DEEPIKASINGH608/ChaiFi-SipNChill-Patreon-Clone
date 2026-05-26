import crypto from "crypto";

export const validatePayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    // We use the secret key from your .env.local file
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Node.js crypto creates a matching signature to verify the payment is real
    const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    // Returns true if authentic, false if fake
    return generated_signature === razorpay_signature;
};


