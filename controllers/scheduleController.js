const Schedule = require("../models/scheduleModel");

/* ================= ADD SCHEDULE ================= */
exports.addSchedule = async (req, res) => {
  try {

    let leagueLogo = req.body.leagueLogo || "";
    let bannerImage = req.body.bannerImage || "";

    // agar file upload hui hai to override kare
    if (req.files?.leagueLogo) {
      leagueLogo = req.files.leagueLogo[0].path;
    }

    if (req.files?.bannerImage) {
      bannerImage = req.files.bannerImage[0].path;
    }

    const schedule = await Schedule.create({
      ...req.body,
      leagueLogo,
      bannerImage
    });

    res.status(201).json({
      success: true,
      message: "Schedule added successfully",
      data: schedule
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET ALL ================= */
exports.getSchedule = async (req, res) => {
  try {

    const data = await Schedule.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      total: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET SINGLE ================= */
exports.getSingleSchedule = async (req, res) => {
  try {

    const data = await Schedule.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= UPDATE ================= */
exports.updateSchedule = async (req, res) => {
  try {

    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (req.files?.leagueLogo) {
      schedule.leagueLogo = req.files.leagueLogo[0].path;
    }

    if (req.files?.bannerImage) {
      schedule.bannerImage = req.files.bannerImage[0].path;
    }

    Object.assign(schedule, req.body);

    await schedule.save();

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE ================= */
exports.deleteSchedule = async (req, res) => {
  try {

    const deleted = await Schedule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({
      success: true,
      message: "Schedule deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
