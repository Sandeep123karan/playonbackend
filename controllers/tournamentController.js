const Tournament = require("../models/tournamentModel");
const cloudinary = require("../config/cloudinary");

// ➕ Add Tournament
exports.addTournament = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
      });
    }

    const tournament = await Tournament.create({
      title,
      image: req.file.path, // Cloudinary image URL
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// 📋 Get All Tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// 🔍 Get Single Tournament
exports.getSingleTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// ✏️ Update Tournament
exports.updateTournament = async (req, res) => {
  try {
    const { title } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    // Update title
    if (title) {
      tournament.title = title;
    }

    // Update image
    if (req.file) {

      // delete old image from cloudinary
      if (tournament.image) {
        const publicId = tournament.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      }

      tournament.image = req.file.path;
    }

    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Tournament updated successfully",
      data: tournament,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// ❌ Delete Tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    // delete image from cloudinary
    if (tournament.image) {
      const publicId = tournament.image
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    await tournament.deleteOne();

    res.status(200).json({
      success: true,
      message: "Tournament deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
