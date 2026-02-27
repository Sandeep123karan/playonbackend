const express = require("express");
const router = express.Router();

const scheduleCtrl = require("../controllers/scheduleController");
const { protectAdmin } = require("../middleware/authMiddleware");

/* ADMIN */
router.post("/add", scheduleCtrl.addSchedule);
router.put("/update/:id", scheduleCtrl.updateSchedule);
router.delete("/delete/:id",  scheduleCtrl.deleteSchedule);

/* PUBLIC */
router.get("/all", scheduleCtrl.getSchedule);
router.get("/:id", scheduleCtrl.getSingleSchedule);

module.exports = router;
