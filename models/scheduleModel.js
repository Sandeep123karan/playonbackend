const mongoose = require("mongoose");

/* ================= MATCH SCHEMA ================= */
const matchSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },

  team1Logo: { type: String, default: "" },
  team2Logo: { type: String, default: "" },

  bannerImage: { type: String, default: "" },

  matchDateTime: { type: Date },

  status: {
    type: String,
    default: "Upcoming"
  },

  isLive: {
    type: Boolean,
    default: false
  },

  viewers: {
    type: Number,
    default: 0
  },

  liveUrl: { type: String, default: "" },

  sport: { type: String, default: "" },

  country: { type: String, default: "" }

}, { _id: true });


/* ================= SECTION ================= */
const sectionSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  date: { type: String, default: "" },
  matches: [matchSchema]

}, { _id: false });


/* ================= MAIN SCHEDULE ================= */
const scheduleSchema = new mongoose.Schema({

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  leagueName: {
    type: String,
    required: true
  },

  leagueLogo: {
    type: String,
    default: ""
  },

  bannerImage: {
    type: String,
    default: ""
  },

  sections: [sectionSchema]

}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
