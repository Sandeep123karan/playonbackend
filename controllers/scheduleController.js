const Schedule = require("../models/scheduleModel");

/* ================= HELPER ================= */
function parseSections(body, files = []) {

  let sections = [];

  if (body.sections) {
    try {
      sections = typeof body.sections === "string"
        ? JSON.parse(body.sections)
        : body.sections;
    } catch {
      throw new Error("Invalid sections JSON");
    }
  }

  for (const file of files) {

    const team1 = file.fieldname.match(/^team1Logo_s(\d+)_m(\d+)$/);
    const team2 = file.fieldname.match(/^team2Logo_s(\d+)_m(\d+)$/);
    const banner = file.fieldname.match(/^bannerImage_s(\d+)_m(\d+)$/);

    if (team1) {
      const s = Number(team1[1]);
      const m = Number(team1[2]);

      if (sections[s]?.matches?.[m]) {
        sections[s].matches[m].team1Logo = file.path;
      }
    }

    if (team2) {
      const s = Number(team2[1]);
      const m = Number(team2[2]);

      if (sections[s]?.matches?.[m]) {
        sections[s].matches[m].team2Logo = file.path;
      }
    }

    if (banner) {
      const s = Number(banner[1]);
      const m = Number(banner[2]);

      if (sections[s]?.matches?.[m]) {
        sections[s].matches[m].bannerImage = file.path;
      }
    }

  }

  return sections;
}

/* ================= ADD SCHEDULE ================= */
exports.addSchedule = async (req, res) => {
  try {

    const files = req.files || [];

    let leagueLogo = req.body.leagueLogo || "";
    let bannerImage = req.body.bannerImage || "";

    const logoFile = files.find(f => f.fieldname === "leagueLogo");
    const bannerFile = files.find(f => f.fieldname === "bannerImage");

    if (logoFile) leagueLogo = logoFile.path;
    if (bannerFile) bannerImage = bannerFile.path;

    const sections = parseSections(req.body, files);

    const schedule = await Schedule.create({
      category: req.body.category,
      leagueName: req.body.leagueName,
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

/* ================= GET ALL ================= */
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

    if (req.body.category) {
      schedule.category = req.body.category;
    }

    if (req.body.leagueName) {
      schedule.leagueName = req.body.leagueName;
    }

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
