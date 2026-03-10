const Schedule = require("../models/scheduleModel");


/* ================= HELPER ================= */
function parseSections(body, files = []) {

  let sections = [];

  if (body.sections) {
    try {
      sections =
        typeof body.sections === "string"
          ? JSON.parse(body.sections)
          : body.sections;
    } catch {
      throw new Error("Invalid sections JSON");
    }
  }

  files.forEach(file => {

    const parts = file.fieldname.split("_");

    if (parts.length !== 3) return;

    const field = parts[0];
    const sIdx = Number(parts[1].replace("s", ""));
    const mIdx = Number(parts[2].replace("m", ""));

    if (!sections[sIdx] || !sections[sIdx].matches || !sections[sIdx].matches[mIdx]) return;

    if (field === "team1Logo") {
      sections[sIdx].matches[mIdx].team1Logo = file.path;
    }

    if (field === "team2Logo") {
      sections[sIdx].matches[mIdx].team2Logo = file.path;
    }

    if (field === "bannerImage") {
      sections[sIdx].matches[mIdx].bannerImage = file.path;
    }

  });

  return sections;
}


/* ================= ADD SCHEDULE ================= */
exports.addSchedule = async (req, res) => {
  try {

    const { category, leagueName } = req.body;

    if (!category || !leagueName) {
      return res.status(400).json({
        success: false,
        message: "category and leagueName are required"
      });
    }

    const files = req.files || [];

    let leagueLogo = "";
    let bannerImage = "";

    const logoFile = files.find(f => f.fieldname === "leagueLogo");
    const bannerFile = files.find(f => f.fieldname === "bannerImage");

    if (logoFile) leagueLogo = logoFile.path;
    if (bannerFile) bannerImage = bannerFile.path;

    const sections = parseSections(req.body, files);

    const schedule = await Schedule.create({
      category,
      leagueName,
      leagueLogo,
      bannerImage,
      sections
    });

    res.status(201).json({
      success: true,
      message: "Schedule added successfully",
      data: schedule
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= GET ALL SCHEDULE ================= */
exports.getSchedule = async (req, res) => {
  try {

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const schedules = await Schedule
      .find(filter)
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: schedules.length,
      data: schedules
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= GET SCHEDULE BY CATEGORY ================= */
exports.getScheduleByCategory = async (req, res) => {
  try {

    const schedules = await Schedule
      .find({ category: req.params.categoryId })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: schedules.length,
      data: schedules
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= GET SINGLE ================= */
exports.getSingleSchedule = async (req, res) => {
  try {

    const schedule = await Schedule
      .findById(req.params.id)
      .populate("category", "title icon");

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.json({
      success: true,
      data: schedule
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= UPDATE ================= */
exports.updateSchedule = async (req, res) => {
  try {

    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    const files = req.files || [];

    if (req.body.category) schedule.category = req.body.category;
    if (req.body.leagueName) schedule.leagueName = req.body.leagueName;

    const logoFile = files.find(f => f.fieldname === "leagueLogo");
    const bannerFile = files.find(f => f.fieldname === "bannerImage");

    if (logoFile) schedule.leagueLogo = logoFile.path;
    if (bannerFile) schedule.bannerImage = bannerFile.path;

    if (req.body.sections) {
      schedule.sections = parseSections(req.body, files);
    }

    await schedule.save();

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= DELETE ================= */
exports.deleteSchedule = async (req, res) => {
  try {

    const deleted = await Schedule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.json({
      success: true,
      message: "Schedule deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
