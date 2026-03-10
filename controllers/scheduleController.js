// const Schedule = require("../models/scheduleModel");

// /* ================= ADD SCHEDULE ================= */
// exports.addSchedule = async (req, res) => {
//   try {

//     let leagueLogo = req.body.leagueLogo || "";
//     let bannerImage = req.body.bannerImage || "";

//     // agar file upload hui hai to override kare
//     if (req.files?.leagueLogo) {
//       leagueLogo = req.files.leagueLogo[0].path;
//     }

//     if (req.files?.bannerImage) {
//       bannerImage = req.files.bannerImage[0].path;
//     }

//     const schedule = await Schedule.create({
//       ...req.body,
//       leagueLogo,
//       bannerImage
//     });

//     res.status(201).json({
//       success: true,
//       message: "Schedule added successfully",
//       data: schedule
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= GET ALL ================= */
// exports.getSchedule = async (req, res) => {
//   try {

//     const data = await Schedule.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       total: data.length,
//       data
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= GET SINGLE ================= */
// exports.getSingleSchedule = async (req, res) => {
//   try {

//     const data = await Schedule.findById(req.params.id);

//     if (!data) {
//       return res.status(404).json({ message: "Schedule not found" });
//     }

//     res.json({
//       success: true,
//       data
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= UPDATE ================= */
// exports.updateSchedule = async (req, res) => {
//   try {

//     const schedule = await Schedule.findById(req.params.id);

//     if (!schedule) {
//       return res.status(404).json({ message: "Schedule not found" });
//     }

//     if (req.files?.leagueLogo) {
//       schedule.leagueLogo = req.files.leagueLogo[0].path;
//     }

//     if (req.files?.bannerImage) {
//       schedule.bannerImage = req.files.bannerImage[0].path;
//     }

//     Object.assign(schedule, req.body);

//     await schedule.save();

//     res.json({
//       success: true,
//       message: "Schedule updated successfully",
//       data: schedule
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= DELETE ================= */
// exports.deleteSchedule = async (req, res) => {
//   try {

//     const deleted = await Schedule.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Schedule not found" });
//     }

//     res.json({
//       success: true,
//       message: "Schedule deleted successfully"
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




const Schedule = require("../models/scheduleModel");

/* ─────────────────────────────────────────────────
   HELPER — sections JSON parse karo + dynamic
   team logos (team1Logo_s0_m0) merge karo
───────────────────────────────────────────────── */
function parseSections(body, files = []) {
  // sections JSON string → array
  let sections = [];
  if (body.sections) {
    try {
      sections = JSON.parse(body.sections);
    } catch {
      throw new Error("Invalid sections JSON");
    }
  }

  // Dynamic logo files merge karo
  // Field name pattern: team1Logo_s{sIdx}_m{mIdx}
  //                     team2Logo_s{sIdx}_m{mIdx}
  for (const file of files) {
    const m1 = file.fieldname.match(/^team1Logo_s(\d+)_m(\d+)$/);
    const m2 = file.fieldname.match(/^team2Logo_s(\d+)_m(\d+)$/);
    if (m1) {
      const [, sIdx, mIdx] = m1.map(Number);
      if (sections[sIdx]?.matches?.[mIdx]) {
        sections[sIdx].matches[mIdx].team1Logo = file.path;
      }
    }
    if (m2) {
      const [, sIdx, mIdx] = m2.map(Number);
      if (sections[sIdx]?.matches?.[mIdx]) {
        sections[sIdx].matches[mIdx].team2Logo = file.path;
      }
    }
  }

  return sections;
}

/* ─────────────────────────────────────────────────
   ADD SCHEDULE
───────────────────────────────────────────────── */
exports.addSchedule = async (req, res) => {
  try {
    const files = req.files || [];

    // League-level images
    let leagueLogo  = req.body.leagueLogo  || "";
    let bannerImage = req.body.bannerImage || "";
    const logoFile   = files.find(f => f.fieldname === "leagueLogo");
    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (logoFile)   leagueLogo  = logoFile.path;
    if (bannerFile) bannerImage = bannerFile.path;

    // Sections parse + team logos merge
    const sections = parseSections(req.body, files);

    const schedule = await Schedule.create({
      leagueName: req.body.leagueName || "",
      leagueLogo,
      bannerImage,
      sections,
    });

    res.status(201).json({
      success: true,
      message: "Schedule added successfully",
      data: schedule,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────
   GET ALL
───────────────────────────────────────────────── */
exports.getSchedule = async (req, res) => {
  try {
    const data = await Schedule.find().sort({ createdAt: -1 });
    res.json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────
   GET SINGLE
───────────────────────────────────────────────── */
exports.getSingleSchedule = async (req, res) => {
  try {
    const data = await Schedule.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Schedule not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────
   UPDATE — Object.assign NAHI karo (sections string bana deta hai)
───────────────────────────────────────────────── */
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: "Schedule not found" });

    const files = req.files || [];

    // League name
    if (req.body.leagueName !== undefined) {
      schedule.leagueName = req.body.leagueName;
    }

    // League-level images
    const logoFile   = files.find(f => f.fieldname === "leagueLogo");
    const bannerFile = files.find(f => f.fieldname === "bannerImage");
    if (logoFile)   schedule.leagueLogo  = logoFile.path;
    if (bannerFile) schedule.bannerImage = bannerFile.path;

    // Sections (JSON parse + logos merge)
    if (req.body.sections) {
      schedule.sections = parseSections(req.body, files);
    }

    await schedule.save();

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────────
   DELETE
───────────────────────────────────────────────── */
exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Schedule not found" });
    res.json({ success: true, message: "Schedule deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
