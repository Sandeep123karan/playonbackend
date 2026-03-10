const express = require("express");
const router = express.Router();

const scheduleCtrl = require("../controllers/scheduleController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const anyUpload = upload.any();

/* ================= ADMIN ================= */

router.post("/add", protectAdmin, anyUpload, scheduleCtrl.addSchedule);

router.put("/update/:id", protectAdmin, anyUpload, scheduleCtrl.updateSchedule);

router.delete("/delete/:id", protectAdmin, scheduleCtrl.deleteSchedule);


/* ================= PUBLIC ================= */

// get all schedules
router.get("/all", scheduleCtrl.getSchedule);

// get schedules by category
router.get("/category/:categoryId", scheduleCtrl.getScheduleByCategory);

// get single schedule
router.get("/:id", scheduleCtrl.getSingleSchedule);

module.exports = router;
