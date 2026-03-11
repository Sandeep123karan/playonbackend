

const HighlightCategory = require("../models/highlightCategoryModel");
const Category = require("../models/Category");


/* ===============================
   ADD HIGHLIGHT CATEGORY
================================ */
exports.addHighlightCategory = async (req, res) => {
  try {

    const { category, title, description, image } = req.body;

    if (!category || !title || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Category, title, description and image are required"
      });
    }

    // check category exist
    const categoryExist = await Category.findById(category);

    if (!categoryExist) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const newCategory = await HighlightCategory.create({
      category,
      title,
      description,
      image
    });

    res.status(201).json({
      success: true,
      message: "Highlight category added successfully",
      data: newCategory
    });

  } catch (error) {

    console.log("Add Highlight Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
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
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ===============================
   GET SINGLE CATEGORY
================================ */
exports.getSingleHighlightCategory = async (req, res) => {
  try {

    const { id } = req.params;

    const category = await HighlightCategory
      .findById(id)
      .populate("category", "title icon");

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
      message: error.message
    });

  }
};



/* ===============================
   UPDATE CATEGORY
================================ */
exports.updateHighlightCategory = async (req, res) => {
  try {

    const { id } = req.params;
    const { category, title, description, image } = req.body;

    if (category) {

      const categoryExist = await Category.findById(category);

      if (!categoryExist) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

    }

    const updatedCategory = await HighlightCategory.findByIdAndUpdate(
      id,
      {
        category,
        title,
        description,
        image
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Highlight category updated successfully",
      data: updatedCategory
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
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
      message: error.message
    });

  }
};
/* ===============================
   GET HIGHLIGHT CATEGORY BY CATEGORY ID
================================ */
exports.getHighlightCategoryByCategory = async (req, res) => {
  try {

    const { categoryId } = req.params;

    const categories = await HighlightCategory
      .find({ category: categoryId })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
