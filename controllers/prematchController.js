const Prematch = require("../models/Prematch");

/* ================= CREATE PREMATCH ================= */
// exports.createPrematch = async (req, res) => {
//   try {
//     let imageUrl = "";
//     let team1Logo = "";
//     let team2Logo = "";

//     // banner image
//     if (req.files?.image) {
//       imageUrl = req.files.image[0].path;
//     }

//     // team1 logo
//     if (req.files?.team1Logo) {
//       team1Logo = req.files.team1Logo[0].path;
//     }

//     // team2 logo
//     if (req.files?.team2Logo) {
//       team2Logo = req.files.team2Logo[0].path;
//     }

//     const match = await Prematch.create({
//       title: req.body.title,
//       league: req.body.league,
//       videoUrl: req.body.videoUrl,
//       matchType: req.body.matchType,
//       team1: req.body.team1,
//       team2: req.body.team2,
//       isLive: req.body.isLive,
//       viewers: req.body.viewers,
//       matchDate: req.body.matchDate,
//       stadium: req.body.stadium,
//       country: req.body.country,
//       analysis: req.body.analysis,

//       imageUrl,
//       team1Logo,
//       team2Logo
//     });

//     res.status(201).json({
//       success: true,
//       message: "Prematch created successfully",
//       data: match
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };
exports.createPrematch = async (req, res) => {
  try {

    let imageUrl = req.body.imageUrl || "";
    let team1Logo = req.body.team1Logo || "";
    let team2Logo = req.body.team2Logo || "";

    // Agar file upload hui hai to file wali value override karegi
    if (req.files?.image) {
      imageUrl = req.files.image[0].path;
    }

    if (req.files?.team1Logo) {
      team1Logo = req.files.team1Logo[0].path;
    }

    if (req.files?.team2Logo) {
      team2Logo = req.files.team2Logo[0].path;
    }

    const match = await Prematch.create({
      title: req.body.title,
      league: req.body.league,
      videoUrl: req.body.videoUrl,
      matchType: req.body.matchType,
      team1: req.body.team1,
      team2: req.body.team2,
      isLive: req.body.isLive,
      viewers: req.body.viewers,
      matchDate: req.body.matchDate,
      stadium: req.body.stadium,
      country: req.body.country,
      analysis: req.body.analysis,
      imageUrl,
      team1Logo,
      team2Logo
    });

    res.status(201).json({
      success: true,
      message: "Prematch created successfully",
      data: match
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL MATCH ================= */
exports.getAllPrematch = async (req, res) => {
  try {
    const matches = await Prematch.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      total: matches.length,
      data: matches
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET SINGLE ================= */
exports.getSinglePrematch = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({
      success: true,
      data: match
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= UPDATE ================= */
exports.updatePrematch = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    // update images if uploaded
    if (req.files?.image) {
      match.imageUrl = req.files.image[0].path;
    }

    if (req.files?.team1Logo) {
      match.team1Logo = req.files.team1Logo[0].path;
    }

    if (req.files?.team2Logo) {
      match.team2Logo = req.files.team2Logo[0].path;
    }

    // update fields
    match.title = req.body.title || match.title;
    match.league = req.body.league || match.league;
    match.videoUrl = req.body.videoUrl || match.videoUrl;
    match.matchType = req.body.matchType || match.matchType;
    match.team1 = req.body.team1 || match.team1;
    match.team2 = req.body.team2 || match.team2;
    match.isLive = req.body.isLive ?? match.isLive;
    match.viewers = req.body.viewers ?? match.viewers;
    match.matchDate = req.body.matchDate || match.matchDate;
    match.stadium = req.body.stadium || match.stadium;
    match.country = req.body.country || match.country;
    match.analysis = req.body.analysis || match.analysis;

    await match.save();

    res.json({
      success: true,
      message: "Prematch updated",
      data: match
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE ================= */
exports.deletePrematch = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    await match.deleteOne();

    res.json({
      success: true,
      message: "Prematch deleted"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= LIVE TOGGLE ================= */
exports.toggleLive = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.isLive = !match.isLive;
    match.matchType = match.isLive ? "LIVE" : "UPCOMING";

    await match.save();

    res.json({
      success: true,
      message: "Live status updated",
      data: match
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
