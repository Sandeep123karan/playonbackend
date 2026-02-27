const mongoose = require("mongoose");

/* ===== LEAGUE SUB SCHEMA ===== */
const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
});

/* ===== MATCH HIGHLIGHT SCHEMA ===== */
const matchHighlightSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    matchType: {
      type: String,
      enum: ["LIVE", "UPCOMING", "HIGHLIGHT"],
      default: "HIGHLIGHT",
    },

    videoUrl: {
      type: String,
      required: true,
    },

    /* 🔥 League Object */
    league: {
      type: leagueSchema,
      required: true,
    },

    team1: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      logo: {
        type: String,
        required: true,
      },
    },

    team2: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      logo: {
        type: String,
        required: true,
      },
    },

    isLive: {
      type: Boolean,
      default: false,
    },

    viewers: {
      type: Number,
      default: 0,
    },

    startTime: Date,
    endTime: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MatchHighlight", matchHighlightSchema);
