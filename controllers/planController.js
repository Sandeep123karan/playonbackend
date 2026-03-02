const Plan = require("../models/Plan");


// ================= GET ALL PLANS =================
// frontend plans load
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ status: true }).sort({ price: 1 });

    res.json({
      success: true,
      count: plans.length,
      plans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET SINGLE PLAN =================
exports.getSinglePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({
      success: true,
      plan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= CREATE PLAN (ADMIN) =================
exports.createPlan = async (req, res) => {
  try {
    const { title, price, duration, features } = req.body;

    if (!title || !price || !duration) {
      return res.status(400).json({
        message: "Title, price, duration required"
      });
    }

    const plan = await Plan.create({
      title,
      price,
      duration,
      features
    });

    res.json({
      success: true,
      message: "Plan created successfully",
      plan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE PLAN =================
exports.updatePlan = async (req, res) => {
  try {
    const { title, price, duration, features, status } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (title) plan.title = title;
    if (price) plan.price = price;
    if (duration) plan.duration = duration;
    if (features) plan.features = features;
    if (status !== undefined) plan.status = status;

    await plan.save();

    res.json({
      success: true,
      message: "Plan updated successfully",
      plan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE PLAN =================
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.deleteOne();

    res.json({
      success: true,
      message: "Plan deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
