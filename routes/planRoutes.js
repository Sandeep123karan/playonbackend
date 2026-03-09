const express = require("express");
const router = express.Router();

const {
  getPlans,
  getSinglePlan,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus
} = require("../controllers/planController");

const { protectUser } = require("../middleware/auth");

// public
router.get("/", getPlans);
router.get("/:id", getSinglePlan);

// admin
router.post("/create", protectUser, createPlan);
router.put("/:id", protectUser, updatePlan);
router.delete("/:id", protectUser, deletePlan);
router.put("/toggle/:id", protectUser, togglePlanStatus);

module.exports = router;
