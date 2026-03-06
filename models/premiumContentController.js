const PremiumContent = require("../models/premiumContentModel");

/* ===============================
   ADD PREMIUM CONTENT
================================ */
exports.addPremiumContent = async (req, res) => {
  try {
    const { title, imagePath, category, amount, discount, videoUrl, features } =
      req.body;

    /* ---------- Validation ---------- */
    if (!title || !imagePath || !amount || !discount) {
      return res.status(400).json({
        success: false,
        message: "Title, imagePath, amount and discount are required",
      });
    }

    if (features && !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array",
      });
    }

    const premiumContent = await PremiumContent.create({
      title,
      imagePath,
      category,
      amount,
      discount,
      videoUrl,
      features,
    });

    res.status(201).json({
      success: true,
      message: "Premium content added successfully",
      data: premiumContent,
    });
  } catch (error) {
    console.error("Add Premium Content Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   GET ALL PREMIUM CONTENT
================================ */
exports.getAllPremiumContent = async (req, res) => {
  try {
    const contents = await PremiumContent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents,
    });
  } catch (error) {
    console.error("Get Premium Content Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   GET SINGLE PREMIUM CONTENT
================================ */
exports.getPremiumContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await PremiumContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Premium content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get Premium Content By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   UPDATE PREMIUM CONTENT
================================ */
exports.updatePremiumContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await PremiumContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Premium content not found",
      });
    }

    const updatedContent = await PremiumContent.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Premium content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Update Premium Content Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   DELETE PREMIUM CONTENT
================================ */
exports.deletePremiumContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await PremiumContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Premium content not found",
      });
    }

    await PremiumContent.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Premium content deleted successfully",
    });
  } catch (error) {
    console.error("Delete Premium Content Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
