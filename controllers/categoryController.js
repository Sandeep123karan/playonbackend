const Category = require("../models/Category");

/* ===============================
   ADD CATEGORY
================================ */
exports.addCategory = async (req, res) => {
  try {

    const { title, description, icon, image, order } = req.body;

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const exist = await Category.findOne({ slug });

    if (exist) {
      return res.status(400).json({
        success:false,
        message:"Category already exists"
      });
    }

    const category = new Category({
      title,
      slug,
      description,
      icon,
      image,
      order,
      createdBy: req.admin._id
    });

    await category.save();

    res.status(201).json({
      success:true,
      message:"Category created",
      data:category
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};


/* ===============================
   GET ALL CATEGORIES
================================ */
exports.getCategories = async (req, res) => {

  try {

    const categories = await Category.find({ isActive:true })
      .sort({ order:1 });

    res.json({
      success:true,
      count:categories.length,
      data:categories
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


/* ===============================
   GET SINGLE CATEGORY
================================ */
exports.getSingleCategory = async (req, res) => {

  try {

    const category = await Category.findById(req.params.id);

    if(!category){
      return res.status(404).json({
        success:false,
        message:"Category not found"
      });
    }

    res.json({
      success:true,
      data:category
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


/* ===============================
   UPDATE CATEGORY
================================ */
exports.updateCategory = async (req, res) => {

  try {

    const { title, description, icon, image, order, isActive } = req.body;

    let updateData = {
      description,
      icon,
      image,
      order,
      isActive
    };

    if(title){
      updateData.title = title;
      updateData.slug = title.toLowerCase().replace(/\s+/g, "-");
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new:true }
    );

    if(!category){
      return res.status(404).json({
        success:false,
        message:"Category not found"
      });
    }

    res.json({
      success:true,
      message:"Category updated",
      data:category
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


/* ===============================
   DELETE CATEGORY
================================ */
exports.deleteCategory = async (req, res) => {

  try {

    const category = await Category.findByIdAndDelete(req.params.id);

    if(!category){
      return res.status(404).json({
        success:false,
        message:"Category not found"
      });
    }

    res.json({
      success:true,
      message:"Category deleted"
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
