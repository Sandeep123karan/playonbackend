const express = require("express");
const router = express.Router();
const bannerCtrl = require("../controllers/bannerController");
const upload = require("../middleware/upload");

router.post("/add", bannerCtrl.addBanner);
router.get("/", bannerCtrl.getBanners);
router.get("/:id", bannerCtrl.getSingleBanner);
router.put("/update/:id", bannerCtrl.updateBanner);
router.delete("/delete/:id", bannerCtrl.deleteBanner);
router.put("/toggle/:id", bannerCtrl.toggleBanner);

module.exports = router;