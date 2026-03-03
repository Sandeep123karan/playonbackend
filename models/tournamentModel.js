const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tournament title is required"],
      trim: true
    },

    image: {
      type: String,
      required: [true, "Tournament image is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
