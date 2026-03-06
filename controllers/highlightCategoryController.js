const HighlightCategory = require("../models/highlightCategoryModel");


/* ===============================
   ADD HIGHLIGHT CATEGORY
================================ */
exports.addHighlightCategory = async (req, res) => {
  try {

    const { title, description, image } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Title, description and image are required"
      });
    }

    const newCategory = new HighlightCategory({
      title,
      description,
      image
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Highlight category added successfully",
      data: savedCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


/* ===============================
   GET ALL HIGHLIGHT CATEGORIES
================================ */
exports.getHighlightCategories = async (req, res) => {
  try {

    const categories = await HighlightCategory
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


/* ===============================
   GET SINGLE CATEGORY
================================ */
exports.getSingleHighlightCategory = async (req, res) => {
  try {

    const { id } = req.params;

    const category = await HighlightCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


/* ===============================
   UPDATE CATEGORY
================================ */
exports.updateHighlightCategory = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, description, image } = req.body;

    const category = await HighlightCategory.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Highlight category updated successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


/* ===============================
   DELETE CATEGORY
================================ */
exports.deleteHighlightCategory = async (req, res) => {
  try {

    const { id } = req.params;

    const category = await HighlightCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Highlight category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
