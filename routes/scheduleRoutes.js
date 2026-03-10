const express = require("express");
const router = express.Router();

const scheduleCtrl = require("../controllers/scheduleController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// dynamic upload fields support
const anyUpload = upload.any();

/* ================= ADMIN ROUTES ================= */

// add schedule
router.post(
  "/add",
  protectAdmin,
  anyUpload,
  scheduleCtrl.addSchedule
);

// update schedule
router.put(
  "/update/:id",
  protectAdmin,
  anyUpload,
  scheduleCtrl.updateSchedule
);

// delete schedule
router.delete(
  "/delete/:id",
  protectAdmin,
  scheduleCtrl.deleteSchedule
);


/* ================= PUBLIC ROUTES ================= */

// get all schedules
router.get("/all", scheduleCtrl.getSchedule);

// category wise schedule
router.get("/category/:categoryId", scheduleCtrl.getSchedule);

// get single schedule
router.get("/:id", scheduleCtrl.getSingleSchedule);


module.exports = router;
