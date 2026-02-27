const Banner = require("../models/Banner");

/* ================= ADD BANNER ================= */

exports.addBanner = async (req, res) => {
  try {
    let imageUrls = [];

    // CASE 1: File upload via multer
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }
    // CASE 2: Direct URL from body (handle both JSON and form-data)
    else if (req.body && req.body.images) {
      // Handle if images is a string (single URL)
      if (typeof req.body.images === 'string') {
        imageUrls = [req.body.images];
      }
      // Handle if images is an array
      else if (Array.isArray(req.body.images)) {
        imageUrls = req.body.images;
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ 
        message: "Images required",
        received: req.body // Debug: see what was received
      });
    }

    if (imageUrls.length > 3) {
      return res.status(400).json({ message: "Max 3 images allowed" });
    }

    const banner = new Banner({
      images: imageUrls,
      title: req.body.title || null,
      description: req.body.description || null,
      is_active: req.body.is_active ?? true,
      sort_order: parseInt(req.body.sort_order) || 0 // Parse to number
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: "Banner created",
      data: banner
    });

  } catch (err) {
    console.error("Banner creation error:", err);
    res.status(500).json({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// exports.addBanner = async (req, res) => {
//   try {

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "Images required" });
//     }

//     if (req.files.length > 3) {
//       return res.status(400).json({ message: "Max 3 images allowed" });
//     }

//     const imageUrls = req.files.map(file => file.path);

//     const banner = new Banner({
//       images: imageUrls,
//       title: req.body.title || null,
//       description: req.body.description || null,
//       is_active: req.body.is_active ?? true,
//       sort_order: req.body.sort_order || 0
//     });

//     await banner.save();

//     res.status(201).json({
//       success: true,
//       message: "Banner created",
//       data: banner
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// exports.addBanner = async (req, res) => {
//   try {

//     let imageUrls = [];

//     // CASE 1: agar multer file upload hua
//     if (req.files && req.files.length > 0) {
//       imageUrls = req.files.map(file => file.path);
//     }

//     // CASE 2: agar direct url bheja frontend se
//     if (req.body.images) {
//       imageUrls = Array.isArray(req.body.images)
//         ? req.body.images
//         : [req.body.images];
//     }

//     if (imageUrls.length === 0) {
//       return res.status(400).json({ message: "Images required" });
//     }

//     if (imageUrls.length > 3) {
//       return res.status(400).json({ message: "Max 3 images allowed" });
//     }

//     const banner = new Banner({
//       images: imageUrls,
//       title: req.body.title || null,
//       description: req.body.description || null,
//       is_active: req.body.is_active ?? true,
//       sort_order: req.body.sort_order || 0
//     });

//     await banner.save();

//     res.status(201).json({
//       success: true,
//       message: "Banner created",
//       data: banner
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

/* ================= GET ALL ================= */
exports.getBanners = async (req, res) => {
  try {

    const banners = await Banner.find().sort({ sort_order: 1 });

    res.json({
      success: true,
      total: banners.length,
      data: banners
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET SINGLE ================= */
exports.getSingleBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      success: true,
      data: banner
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= UPDATE ================= */
exports.updateBanner = async (req, res) => {
  try {

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      is_active: req.body.is_active,
      sort_order: req.body.sort_order,
      updated_at: Date.now()
    };

    // agar new images upload hui
    if (req.files && req.files.length > 0) {

      if (req.files.length > 3) {
        return res.status(400).json({ message: "Max 3 images allowed" });
      }

      updateData.images = req.files.map(file => file.path);
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      success: true,
      message: "Banner updated",
      data: banner
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE ================= */
exports.deleteBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner deleted"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= TOGGLE ================= */
exports.toggleBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.is_active = !banner.is_active;
    await banner.save();

    res.json({
      success: true,
      message: "Status updated",
      data: banner
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};