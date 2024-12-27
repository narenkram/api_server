import express from "express";
import Razorpay from "razorpay";
import dotenv from 'dotenv';

// Load environment variables at the start of the file
dotenv.config();

const router = express.Router();

// Verify environment variables are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials missing in environment variables');
}

// Initialize Razorpay after environment variables are loaded
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/create", async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      customer_notify: 1,
      total_count: 12,
    });

    res.json({
      subscriptionId: subscription.id,
      amount: subscription.total_amount,
      currency: subscription.currency,
      key_id: process.env.RAZORPAY_KEY_ID!,
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

export default router;
