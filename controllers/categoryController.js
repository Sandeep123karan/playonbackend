const Category = require("../models/Category");

/* ===============================
   ADD CATEGORY
================================ */
exports.addCategory = async (req, res) => {
  try {

    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const exist = await Category.findOne({ slug });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    // images from cloudinary
    const icon = req.files?.icon?.[0]?.path || "";
    const image = req.files?.image?.[0]?.path || "";

    const category = await Category.create({
      title,
      slug,
      description,
      icon,
      image,
      order,
      createdBy: req.admin?._id
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
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
   GET ALL CATEGORIES
================================ */
exports.getCategories = async (req, res) => {

  try {

    const categories = await Category
      .find({ isActive: true })
      .sort({ order: 1 });

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
exports.getSingleCategory = async (req, res) => {

  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
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
exports.updateCategory = async (req, res) => {

  try {

    const { title, description, order, isActive } = req.body;

    let updateData = {
      description,
      order,
      isActive
    };

    if (title) {
      updateData.title = title;
      updateData.slug = title.toLowerCase().replace(/\s+/g, "-");
    }

    // update images if uploaded
    if (req.files?.icon) {
      updateData.icon = req.files.icon[0].path;
    }

    if (req.files?.image) {
      updateData.image = req.files.image[0].path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
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
   DELETE CATEGORY
================================ */
exports.deleteCategory = async (req, res) => {

  try {

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
