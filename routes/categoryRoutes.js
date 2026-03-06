const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");

/* ADMIN */
router.post("/add", protectAdmin, adminOnly, categoryController.addCategory);
router.put("/update/:id", protectAdmin, adminOnly, categoryController.updateCategory);
router.delete("/delete/:id", protectAdmin, adminOnly, categoryController.deleteCategory);

/* PUBLIC */
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getSingleCategory);

module.exports = router;
