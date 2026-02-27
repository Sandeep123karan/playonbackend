const MatchHighlight = require("../models/MatchHighlight");

/* =========================================================
   ADD MATCH HIGHLIGHT (ADMIN ONLY)
========================================================= */
exports.addHighlight = async (req, res) => {
  try {
    // admin info from middleware
    const adminId = req.admin?.id;

    const {
      imageUrl,
      title,
      matchType,
      videoUrl,
      league,
      team1,
      team2,
      isLive,
      viewers,
      startTime,
      endTime,
    } = req.body;

    if (!title || !videoUrl || !league || !team1 || !team2) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const highlight = await MatchHighlight.create({
      imageUrl,
      title,
      matchType,
      videoUrl,
      league,
      team1,
      team2,
      isLive,
      viewers,
      startTime,
      endTime,
      createdBy: adminId,
    });

    res.status(201).json({
      success: true,
      message: "Highlight added successfully",
      data: highlight,
    });
  } catch (err) {
    console.log("Add highlight error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   GET ALL HIGHLIGHTS (PUBLIC)
========================================================= */
exports.getAllHighlights = async (req, res) => {
  try {
    const highlights = await MatchHighlight.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: highlights.length,
      data: highlights,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   GET SINGLE HIGHLIGHT (PUBLIC)
========================================================= */
exports.getSingleHighlight = async (req, res) => {
  try {
    const highlight = await MatchHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json({
      success: true,
      data: highlight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   UPDATE HIGHLIGHT (ADMIN ONLY)
========================================================= */
exports.updateHighlight = async (req, res) => {
  try {
    const highlight = await MatchHighlight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json({
      success: true,
      message: "Highlight updated",
      data: highlight,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   DELETE HIGHLIGHT (ADMIN ONLY)
========================================================= */
exports.deleteHighlight = async (req, res) => {
  try {
    const highlight = await MatchHighlight.findByIdAndDelete(req.params.id);

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    res.json({
      success: true,
      message: "Highlight deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   TOGGLE LIVE STATUS (ADMIN ONLY)
========================================================= */
exports.toggleLive = async (req, res) => {
  try {
    const highlight = await MatchHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    highlight.isLive = !highlight.isLive;
    await highlight.save();

    res.json({
      success: true,
      message: "Live status updated",
      data: highlight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   INCREASE VIEWERS (PUBLIC)
========================================================= */
exports.addViewer = async (req, res) => {
  try {
    const highlight = await MatchHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    highlight.viewers += 1;
    await highlight.save();

    res.json({
      success: true,
      viewers: highlight.viewers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
