const express = require("express");
const router = express.Router();

const tournamentController = require("../controllers/tournamentController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

const upload = require("../middleware/upload"); // 👈 important

// Public Routes
router.get("/", tournamentController.getAllTournaments);
router.get("/:id", tournamentController.getSingleTournament);

// Protected Routes
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.single("image"), // 👈 image upload
  tournamentController.addTournament
);

router.put(
  "/:id",
  protectAdmin,
  adminOnly,
  upload.single("image"), // 👈 image update
  tournamentController.updateTournament
);

router.delete(
  "/:id",
  protectAdmin,
  adminOnly,
  tournamentController.deleteTournament
);

module.exports = router;
