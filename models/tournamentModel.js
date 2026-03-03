const express = require("express");
const router = express.Router();

const tournamentController = require("../controllers/tournamentController");

// 🔐 Admin Middleware
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", tournamentController.getAllTournaments);
router.get("/:id", tournamentController.getSingleTournament);

// 🔐 Protected Routes (Token Required)
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  tournamentController.addTournament
);

router.put(
  "/:id",
  protectAdmin,
  adminOnly,
  tournamentController.updateTournament
);

router.delete(
  "/:id",
  protectAdmin,
  adminOnly,
  tournamentController.deleteTournament
);

module.exports = router;
