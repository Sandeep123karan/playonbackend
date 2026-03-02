// const mongoose = require("mongoose");

// /* ===== LEAGUE SUB SCHEMA ===== */
// const leagueSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
// });

// /* ===== MATCH HIGHLIGHT SCHEMA ===== */
// const matchHighlightSchema = new mongoose.Schema(
//   {
//     imageUrl: {
//       type: String,
//       required: true,
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     matchType: {
//       type: String,
//       enum: ["LIVE", "UPCOMING", "HIGHLIGHT"],
//       default: "HIGHLIGHT",
//     },

//     videoUrl: {
//       type: String,
//       required: true,
//     },

//     /* 🔥 League Object */
//     league: {
//       type: leagueSchema,
//       required: true,
//     },

//     team1: {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       logo: {
//         type: String,
//         required: true,
//       },
//     },

//     team2: {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       logo: {
//         type: String,
//         required: true,
//       },
//     },

//     isLive: {
//       type: Boolean,
//       default: false,
//     },

//     viewers: {
//       type: Number,
//       default: 0,
//     },

//     startTime: Date,
//     endTime: Date,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("MatchHighlight", matchHighlightSchema);




// // const mongoose = require("mongoose");

// // const matchHighlightSchema = new mongoose.Schema(
// //   {
// //     league: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     team1: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     team2: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     team1Logo: {
// //       type: String,
// //       required: true,
// //     },

// //     team2Logo: {
// //       type: String,
// //       required: true,
// //     },

// //     bannerImage: {
// //       type: String,
// //       required: true,
// //     },

// //     videoUrl: {
// //       type: String,
// //       required: false, // highlight video optional
// //     },

// //     isLive: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     viewers: {
// //       type: Number,
// //       default: 0,
// //     },

// //     matchId: {
// //       type: String,
// //       default: null,
// //     },

// //        matchTime: {
// //       type: String,
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("MatchHighlight", matchHighlightSchema);







const mongoose = require("mongoose");

const matchHighlightSchema = new mongoose.Schema(
{
  league: {
    type: String,
    required: true
  },

  team1: {
    type: String,
    required: true
  },

  team2: {
    type: String,
    required: true
  },

  team1Logo: {
    type: String,
    required: true
  },

  team2Logo: {
    type: String,
    required: true
  },

  bannerImage: {
    type: String,
    required: true
  },

  videoUrl: String,

  isLive: {
    type: Boolean,
    default: false
  },

  viewers: {
    type: Number,
    default: 0
  },

  matchId: String,

  matchTime: {
    type: String,
    required: true
  }

},
{ timestamps:true }
);

module.exports = mongoose.model("MatchHighlight", matchHighlightSchema);
