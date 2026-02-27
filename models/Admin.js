// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const adminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },

//   password: {
//     type: String,
//     required: true
//   },

//   role: {
//     type: String,
//     default: "admin"
//   }

// }, { timestamps: true });


// /* ================= HASH PASSWORD ================= */
// adminSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) {
//       return next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     next();

//   } catch (error) {
//     next(error);
//   }
// });


// /* ================= MATCH PASSWORD ================= */
// adminSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("Admin", adminSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "admin"
  }

}, { timestamps: true });


/* ================= HASH PASSWORD ================= */
adminSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


/* ================= MATCH PASSWORD ================= */
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);