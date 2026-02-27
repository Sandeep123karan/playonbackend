const express = require("express");
const router = express.Router();

/* ===== CONTROLLER IMPORT ===== */
const {
  registerAdmin,
  loginAdmin
} = require("../controllers/adminAuthController");

/* ===== MIDDLEWARE IMPORT ===== */
const {
  protectAdmin,
  adminOnly
} = require("../middleware/authMiddleware");


/* ================= ADMIN AUTH ================= */

// register admin
router.post("/register", registerAdmin);

// login admin
router.post("/login", loginAdmin);


/* ================= ADMIN PRIVATE ================= */

// admin profile check
router.get("/profile", protectAdmin, adminOnly, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

module.exports = router;
