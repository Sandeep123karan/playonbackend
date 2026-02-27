const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

/* ================= GENERATE JWT TOKEN ================= */
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


/* ================= REGISTER ADMIN ================= */
// exports.registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     // check existing
//     const adminExist = await Admin.findOne({ email });
//     if (adminExist) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     // create admin
//     const admin = await Admin.create({
//       name,
//       email,
//       password
//     });

//     res.status(201).json({
//       success: true,
//       message: "Admin registered successfully",
//       token: generateToken(admin),
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role
//       }
//     });

//   } catch (err) {
//     console.log("Register error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.registerAdmin = async (req,res)=>{
  try{
    const { name, email, password } = req.body;

    const adminExist = await Admin.findOne({ email });
    if(adminExist){
      return res.status(400).json({ message:"Admin already exists" });
    }

    const admin = await Admin.create({ name,email,password });

    res.json({
      success:true,
      message:"Admin created",
      token: generateToken(admin._id, admin.role)
    });

  }catch (err) {
    console.log("🔥 REAL REGISTER ERROR:", err);
    res.status(500).json({ 
      message: err.message,
      error: err
    });
  }
};

/* ================= LOGIN ADMIN ================= */
// exports.loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // validation
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     // find admin
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ message: "Invalid email" });
//     }

//     // match password
//     const isMatch = await admin.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Wrong password" });
//     }

//     res.json({
//       success: true,
//       message: "Login successful",
//       token: generateToken(admin),
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role
//       }
//     });

//   } catch (err) {
//     console.log("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.loginAdmin = async (req,res)=>{
  try{
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if(!admin){
      return res.status(400).json({ message:"Invalid email" });
    }

    const isMatch = await admin.matchPassword(password);

    if(!isMatch){
      return res.status(400).json({ message:"Wrong password" });
    }

    res.json({
      success:true,
      message:"Login success",
      token: generateToken(admin._id, admin.role),
      admin:{
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  }catch (err) {
    console.log("🔥 REAL LOGIN ERROR:", err);
    res.status(500).json({ 
      message: err.message,
      error: err
    });
  }
};