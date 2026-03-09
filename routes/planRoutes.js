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
router.post("/create", protectAdmin, adminOnly, createPlan);
router.put("/:id", protectAdmin, adminOnly, updatePlan);
router.delete("/:id", protectAdmin, adminOnly, deletePlan);
router.put("/toggle/:id", protectAdmin, adminOnly, togglePlanStatus);
