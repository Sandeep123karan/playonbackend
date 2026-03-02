const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: String,          // 1 Month, 6 Months
  price: Number,          // 99,199
  duration: Number,       // days
  features: [String],
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Plan", planSchema);
