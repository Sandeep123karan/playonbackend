const express = require("express");
const router = express.Router();
const tv = require("../controllers/liveTvController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ===== ADMIN ===== */
router.post("/admin/add", protectAdmin, adminOnly, upload.single("logo"), tv.addLiveTV);
router.put("/admin/update/:id", protectAdmin, adminOnly, upload.single("logo"), tv.updateLiveTV);
router.delete("/admin/delete/:id", protectAdmin, adminOnly, tv.deleteLiveTV);
router.patch("/admin/toggle/:id", protectAdmin, adminOnly, tv.toggleLiveTV);

/* ===== USER ===== */
router.get("/all", tv.getAllLiveTV);
router.get("/category/:category", tv.getByCategory);
router.get("/:id", tv.getSingleTV);
router.patch("/viewer/:id", tv.increaseViewer);

module.exports = router;
