// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");

// /* ================= PROTECT ================= */
// exports.protectAdmin = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const admin = await Admin.findById(decoded.id).select("-password");

//     if (!admin) {
//       return res.status(401).json({ message: "Admin not found" });
//     }

//     req.admin = admin;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };

// /* ================= ADMIN ONLY ================= */
// exports.adminOnly = (req, res, next) => {
//   if (req.admin && req.admin.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Admin only access" });
//   }
// };




const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/* ================= PROTECT ADMIN ================= */

exports.protectAdmin = async (req, res, next) => {
  try {

    let token;

    // check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find admin
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found"
      });
    }

    // attach admin to request
    req.admin = admin;

    next();

  } catch (error) {

    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }
};


/* ================= ADMIN ONLY ================= */

exports.adminOnly = (req, res, next) => {

  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required"
    });
  }

  if (req.admin.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }

  next();
};
