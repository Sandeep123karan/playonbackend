const mongoose = require("mongoose");

// plan duration options schema
const optionSchema = new mongoose.Schema({
  label: {
    type: String,           // 1 Month, 3 Months
    required: true
  },
  duration: {
    type: Number,           // days (30, 90, 180)
    required: true
  },
  price: {
    type: Number,           // 99,199
    required: true
  }
}, { _id: true });


// main plan schema
const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Ads Free", "All Content Free"]
    },

    description: {
      type: String
    },

    options: [optionSchema],   // multiple pricing options

    features: [
      {
        type: String
      }
    ],

    status: {
      type: Boolean,
      default: true
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Plan", planSchema);
