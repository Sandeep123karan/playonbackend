const express = require("express");
const router = express.Router();

const scheduleCtrl = require("../controllers/scheduleController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ================= ADMIN ================= */

// upload images
const cpUpload = upload.fields([
  { name: "leagueLogo", maxCount: 1 },
  { name: "team1Logo", maxCount: 1 },
  { name: "team2Logo", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 }
]);

// add schedule
router.post(
  "/add",
  protectAdmin,
  cpUpload,
  scheduleCtrl.addSchedule
);

// update schedule
router.put(
  "/update/:id",
  protectAdmin,
  cpUpload,
  scheduleCtrl.updateSchedule
);

// delete
router.delete(
  "/delete/:id",
  protectAdmin,
  scheduleCtrl.deleteSchedule
);


/* ================= PUBLIC ================= */

router.get("/all", scheduleCtrl.getSchedule);
router.get("/:id", scheduleCtrl.getSingleSchedule);

module.exports = router;
