const MatchCard = require("../models/matchCardModel");

/* ================= ADD MATCH ================= */
exports.addMatch = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      matchType,
      videoUrl,
      league,
      team1,
      team2,
      team1Logo,
      team2Logo,
      isLive,
      viewers
    } = req.body;

    // Basic Validation
    if (
      !title ||
      !imageUrl ||
      !league ||
      !team1 ||
      !team2 ||
      !team1Logo ||
      !team2Logo
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const match = await MatchCard.create({
      title,
      imageUrl,
      matchType,
      videoUrl,
      league,
      team1,
      team2,
      team1Logo,
      team2Logo,
      isLive,
      viewers
    });

    res.status(201).json({
      success: true,
      message: "Match added successfully",
      data: match,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL MATCHES ================= */
exports.getAllMatches = async (req, res) => {
  try {
    // LIVE matches top pe
    const matches = await MatchCard.find().sort({
      isLive: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE MATCH ================= */
exports.getSingleMatch = async (req, res) => {
  try {
    const match = await MatchCard.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      data: match,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE MATCH ================= */
exports.updateMatch = async (req, res) => {
  try {
    const match = await MatchCard.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    Object.assign(match, req.body);

    await match.save();

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      data: match,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE MATCH ================= */
exports.deleteMatch = async (req, res) => {
  try {
    const match = await MatchCard.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
