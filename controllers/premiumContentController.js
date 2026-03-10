const PremiumContent = require("../models/premiumContentModel");


/* ===============================
   ADD PREMIUM CONTENT
================================ */
exports.addPremiumContent = async (req, res) => {
  try {

    const { title, category, amount, discount, videoUrl, features } = req.body;

    const imagePath = req.file ? req.file.path : "";

    if (!title || !imagePath || !amount || !discount) {
      return res.status(400).json({
        success: false,
        message: "Title, image, amount and discount are required",
      });
    }

    let parsedFeatures = features;

    if (features && typeof features === "string") {
      parsedFeatures = JSON.parse(features);
    }

    if (parsedFeatures && !Array.isArray(parsedFeatures)) {
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
      features: parsedFeatures,
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

    const contents = await PremiumContent
      .find()
      .sort({ createdAt: -1 });

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

    if (req.file) {
      req.body.imagePath = req.file.path;
    }

    if (req.body.features && typeof req.body.features === "string") {
      req.body.features = JSON.parse(req.body.features);
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
