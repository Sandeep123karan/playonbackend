const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");

const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");


// Public
router.get("/", matchController.getAllMatches);
router.get("/tournament/:tournamentId", matchController.getMatchesByTournament);
router.get("/:id", matchController.getSingleMatch);


// Admin
router.post("/add", protectAdmin, adminOnly, matchController.addMatch);
router.put("/:id", protectAdmin, adminOnly, matchController.updateMatch);
router.delete("/:id", protectAdmin, adminOnly, matchController.deleteMatch);


module.exports = router;
