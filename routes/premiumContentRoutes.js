const router = require("express").Router();
const premiumCtrl = require("../controllers/premiumContentController");

const {
  protectAdmin,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload"); // 👈 important


/* ===============================
   ADD PREMIUM CONTENT
================================ */
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.single("image"),   // 👈 image upload
  premiumCtrl.addPremiumContent
);


/* ===============================
   GET ALL PREMIUM CONTENT
================================ */
router.get("/", premiumCtrl.getAllPremiumContent);


/* ===============================
   GET SINGLE PREMIUM CONTENT
================================ */
router.get("/:id", premiumCtrl.getPremiumContentById);


/* ===============================
   UPDATE PREMIUM CONTENT
================================ */
router.put(
  "/:id",
  protectAdmin,
  adminOnly,
  upload.single("image"),   // 👈 image update
  premiumCtrl.updatePremiumContent
);


/* ===============================
   DELETE PREMIUM CONTENT
================================ */
router.delete(
  "/:id",
  protectAdmin,
  adminOnly,
  premiumCtrl.deletePremiumContent
);

module.exports = router;
