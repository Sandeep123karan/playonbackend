const mongoose = require("mongoose");

/* ================= MATCH SCHEMA ================= */
const matchSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },

  team1Logo: String,
  team2Logo: String,

  venue: String,
  status: String, // Completed, Upcoming
  isLive: { type: Boolean, default: false },
  liveUrl: String
}, { _id: false });

/* ================= SECTION SCHEMA ================= */
const sectionSchema = new mongoose.Schema({
  date: String,   // Today 30th Jan
  title: String,  // Live Matches / Global League
  matches: [matchSchema]
}, { _id: false });

/* ================= MAIN SCHEDULE ================= */
const scheduleSchema = new mongoose.Schema({
  leagueName: String,  // optional
  sections: [sectionSchema],
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
