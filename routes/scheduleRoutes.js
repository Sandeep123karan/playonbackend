// const express = require("express");
// const router = express.Router();

// const scheduleCtrl = require("../controllers/scheduleController");
// const { protectAdmin } = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");

// /* ================= ADMIN ================= */

// // upload images
// const cpUpload = upload.fields([
//   { name: "leagueLogo", maxCount: 1 },
//   { name: "team1Logo", maxCount: 1 },
//   { name: "team2Logo", maxCount: 1 },
//   { name: "bannerImage", maxCount: 1 }
// ]);

// // add schedule
// router.post(
//   "/add",
//   protectAdmin,
//   cpUpload,
//   scheduleCtrl.addSchedule
// );

// // update schedule
// router.put(
//   "/update/:id",
//   protectAdmin,
//   cpUpload,
//   scheduleCtrl.updateSchedule
// );

// // delete
// router.delete(
//   "/delete/:id",
//   protectAdmin,
//   scheduleCtrl.deleteSchedule
// );


// /* ================= PUBLIC ================= */

// router.get("/all", scheduleCtrl.getSchedule);
// router.get("/:id", scheduleCtrl.getSingleSchedule);

// module.exports = router;


const express = require("express");
const router = express.Router();
const scheduleCtrl = require("../controllers/scheduleController");
const { protectAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// upload.any() — dynamic field names support karta hai
// team1Logo_s0_m0, team1Logo_s1_m2 jaise fields bhi accept karta hai
const anyUpload = upload.any();

/* ================= ADMIN ================= */
router.post("/add",          protectAdmin, anyUpload, scheduleCtrl.addSchedule);
router.put("/update/:id",    protectAdmin, anyUpload, scheduleCtrl.updateSchedule);
router.delete("/delete/:id", protectAdmin,            scheduleCtrl.deleteSchedule);

/* ================= PUBLIC ================= */
router.get("/all", scheduleCtrl.getSchedule);
router.get("/:id", scheduleCtrl.getSingleSchedule);

module.exports = router;
