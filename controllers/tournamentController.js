const Tournament = require("../models/tournamentModel");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");


/* ================= ADD TOURNAMENT ================= */

exports.addTournament = async (req, res) => {
  try {

    const { title, category, image } = req.body;

    // image from multer OR json
    const imageUrl = req.file?.path || image;

    if (!title || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, category and image are required"
      });
    }

    // check category
    const categoryExist = await Category.findById(category);

    if (!categoryExist) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const tournament = await Tournament.create({
      title,
      category,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================= GET ALL TOURNAMENTS ================= */

exports.getAllTournaments = async (req, res) => {
  try {

    const tournaments = await Tournament
      .find()
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================= GET SINGLE TOURNAMENT ================= */

exports.getSingleTournament = async (req, res) => {
  try {

    const tournament = await Tournament
      .findById(req.params.id)
      .populate("category", "title icon");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    res.status(200).json({
      success: true,
      data: tournament
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================= UPDATE TOURNAMENT ================= */

exports.updateTournament = async (req, res) => {
  try {

    const { title, category, image } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (title) tournament.title = title;

    if (category) tournament.category = category;

    if (req.file?.path) {

      // delete old cloudinary image
      if (tournament.image) {

        const publicId = tournament.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      }

      tournament.image = req.file.path;

    } else if (image) {

      tournament.image = image;
    }

    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Tournament updated successfully",
      data: tournament
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ================= DELETE TOURNAMENT ================= */

exports.deleteTournament = async (req, res) => {
  try {

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

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
      message: "Tournament deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
exports.getTournamentsByCategory = async (req, res) => {
  try {

    const { categoryId } = req.params;

    const tournaments = await Tournament
      .find({ category: categoryId })
      .populate("category", "title icon");

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
