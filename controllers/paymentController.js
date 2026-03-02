

const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET  // ✅ fixed
});


// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "planId required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid planId"
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    await Subscription.create({
      user: req.user.id,
      plan: plan._id,
      orderId: order.id,
      amount: plan.price,
      status: "pending"
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: plan.price,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment data"
      });
    }

    // verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)  // ✅ fixed
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // prevent duplicate activation
    const subscription = await Subscription.findOneAndUpdate(
      { orderId, status: "pending" },  // ✅ only pending subscription update hogi
      { $set: { status: "active", paymentId } },
      { new: true }
    ).populate("plan");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or already processed"
      });
    }

    if (!subscription.plan?.duration) {
      return res.status(500).json({
        success: false,
        message: "Plan duration not configured"
      });
    }

    subscription.startDate = new Date();
    subscription.endDate = new Date(
      Date.now() + subscription.plan.duration * 24 * 60 * 60 * 1000
    );
    await subscription.save();

    res.json({
      success: true,
      message: "Payment successful & subscription activated"
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= MY SUBSCRIPTION =================
exports.mySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user.id,
      status: "active"
    })
    .sort({ createdAt: -1 })  // ✅ latest subscription
    .populate("plan");

    if (!sub) {
      return res.json({
        active: false,
        message: "No active subscription"
      });
    }

    if (sub.endDate < new Date()) {
      sub.status = "expired";
      await sub.save();

      return res.json({
        active: false,
        message: "Subscription expired"
      });
    }

    res.json({
      active: true,
      subscription: sub
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
