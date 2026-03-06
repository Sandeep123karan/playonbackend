const router = require("express").Router();

const highlightCategoryController = require("../controllers/highlightCategoryController");

const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

/* ================= ADD CATEGORY (ADMIN) ================= */
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  highlightCategoryController.addHighlightCategory
);

/* ================= GET ALL (PUBLIC) ================= */
router.get(
  "/",
  highlightCategoryController.getHighlightCategories
);

/* ================= GET SINGLE (PUBLIC) ================= */
router.get(
  "/:id",
  highlightCategoryController.getSingleHighlightCategory
);

/* ================= UPDATE (ADMIN) ================= */
router.put(
  "/:id",
  protectAdmin,
  adminOnly,
  highlightCategoryController.updateHighlightCategory
);

/* ================= DELETE (ADMIN) ================= */
router.delete(
  "/:id",
  protectAdmin,
  adminOnly,
  highlightCategoryController.deleteHighlightCategory
);

module.exports = router;
