const Subscription = require("../models/Subscription");


// ================= MY SUBSCRIPTION =================
// user ka active subscription check
exports.mySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user.id,
      status: "active"
    }).populate("plan");

    if (!sub) {
      return res.json({
        active: false,
        message: "No active subscription"
      });
    }

    // expiry check
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
    res.status(500).json({ message: error.message });
  }
};



// ================= ALL SUBSCRIPTIONS (ADMIN) =================
exports.allSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate("user", "fullName email")
      .populate("plan");

    res.json({
      success: true,
      total: subs.length,
      subscriptions: subs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE SUBSCRIPTION (ADMIN) =================
exports.deleteSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await sub.deleteOne();

    res.json({
      success: true,
      message: "Subscription deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
