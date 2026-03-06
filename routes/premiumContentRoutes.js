const router = require("express").Router();
const premiumCtrl = require("../controllers/premiumContentController");

const {
  protectAdmin,
  adminOnly,
} = require("../middleware/authMiddleware");

/* ===============================
   ADD PREMIUM CONTENT
   (ADMIN TOKEN REQUIRED)
================================ */
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  premiumCtrl.addPremiumContent
);

/* ===============================
   GET ALL PREMIUM CONTENT
   (PUBLIC)
================================ */
router.get("/", premiumCtrl.getAllPremiumContent);

/* ===============================
   GET SINGLE PREMIUM CONTENT
================================ */
router.get("/:id", premiumCtrl.getPremiumContentById);

/* ===============================
   UPDATE PREMIUM CONTENT
   (ADMIN TOKEN REQUIRED)
================================ */
router.put(
  "/:id",
  protectAdmin,
  adminOnly,
  premiumCtrl.updatePremiumContent
);

/* ===============================
   DELETE PREMIUM CONTENT
   (ADMIN TOKEN REQUIRED)
================================ */
router.delete(
  "/:id",
  protectAdmin,
  adminOnly,
  premiumCtrl.deletePremiumContent
);

module.exports = router;
