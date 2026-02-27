const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

/* ================= GENERATE TOKEN ================= */
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ================= REGISTER ADMIN ================= */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token: generateToken(admin),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ADMIN ================= */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(admin),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
