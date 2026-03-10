const LiveTV = require("../models/LiveTV");
const Subscription = require("../models/Subscription");


exports.addLiveTV = async (req, res) => {
  try {
    const { name, streamUrl, category, language, country, isPremium, order, description } = req.body;

    if (!name || !streamUrl) {
      return res.status(400).json({ message: "Name and Stream URL required" });
    }

    const logo = req.file ? req.file.path : req.body.logo;  // 🔥 important

    if (!logo) {
      return res.status(400).json({ message: "Logo required" });
    }

    const tv = await LiveTV.create({
      name,
      logo,
      streamUrl,
      category,
      language,
      country,
      isPremium,
      order,
      description
    });

    res.status(201).json({
      success: true,
      message: "Live TV added",
      data: tv
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADMIN: UPDATE LIVE TV
===================================================== */
exports.updateLiveTV = async (req, res) => {
  try {
    const tv = await LiveTV.findById(req.params.id);
    if (!tv) return res.status(404).json({ message: "Channel not found" });

    const {
      name,
      streamUrl,
      category,
      language,
      country,
      status,
      isPremium,
      order,
      description
    } = req.body;

    if (req.file) {
      tv.logo = req.file.path;
    }

    tv.name = name || tv.name;
    tv.streamUrl = streamUrl || tv.streamUrl;
    tv.category = category || tv.category;
    tv.language = language || tv.language;
    tv.country = country || tv.country;
    tv.status = status || tv.status;
    tv.isPremium = isPremium ?? tv.isPremium;
    tv.order = order ?? tv.order;
    tv.description = description || tv.description;

    await tv.save();

    res.json({
      success: true,
      message: "Live TV updated",
      data: tv
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================================================
   ADMIN: DELETE LIVE TV
===================================================== */
exports.deleteLiveTV = async (req, res) => {
  try {
    const tv = await LiveTV.findById(req.params.id);
    if (!tv) return res.status(404).json({ message: "Channel not found" });

    await tv.deleteOne();

    res.json({
      success: true,
      message: "Channel deleted"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================================================
   ADMIN: TOGGLE ACTIVE/INACTIVE
===================================================== */
exports.toggleLiveTV = async (req, res) => {
  try {
    const tv = await LiveTV.findById(req.params.id);
    if (!tv) return res.status(404).json({ message: "Channel not found" });

    tv.status = tv.status === "active" ? "inactive" : "active";
    await tv.save();

    res.json({
      success: true,
      message: "Status updated",
      data: tv
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================================================
   USER: GET ALL LIVE TV
===================================================== */
exports.getAllLiveTV = async (req, res) => {
  try {
    const tv = await LiveTV.find({ status: "active" })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      total: tv.length,
      data: tv
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================================================
   USER: GET BY CATEGORY
===================================================== */
exports.getByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const tv = await LiveTV.find({
      category: category,
      status: "active"
    });

    res.json({
      success: true,
      total: tv.length,
      data: tv
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================================================
   USER: SINGLE CHANNEL
===================================================== */
// exports.getSingleTV = async (req, res) => {
//   try {
//     const tv = await LiveTV.findById(req.params.id);

//     if (!tv) return res.status(404).json({ message: "Not found" });

//     res.json({
//       success: true,
//       data: tv
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getSingleTV = async (req, res) => {
  try {

    const tv = await LiveTV.findById(req.params.id);

    if (!tv) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // 🔒 premium channel check
    if (tv.isPremium) {

      const sub = await Subscription.findOne({
        user: req.user?.id,
        status: "active"
      });

      if (!sub) {
        return res.json({
          success: true,
          locked: true,
          message: "Subscription required to watch this channel"
        });
      }
    }

    // 🔓 unlock
    res.json({
      success: true,
      locked: false,
      data: tv
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   VIEWER COUNT INCREASE
===================================================== */
exports.increaseViewer = async (req, res) => {
  try {
    await LiveTV.findByIdAndUpdate(req.params.id, {
      $inc: { viewers: 1 }
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
