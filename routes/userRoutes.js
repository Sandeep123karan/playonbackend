

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require("../controllers/userController");

const { protectUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 profile routes
router.get("/profile", protectUser, getProfile);
router.put("/profile", protectUser, updateProfile);

module.exports = router;
