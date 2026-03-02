// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const bannerRoutes = require("./routes/bannerRoutes");
// const scheduleRoutes = require("./routes/scheduleRoutes");
// const highlightRoutes = require("./routes/highlightRoutes");
// const liveTvRoutes = require("./routes/liveTvRoutes");
// const prematchRoutes = require("./routes/prematchRoutes");
// const userRoutes = require("./routes/userRoutes");
// const planRoutes = require("./routes/planRoutes");


// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URL)
// .then(()=>console.log("🔥 MongoDB Connected"))
// .catch(err=>console.log("Mongo Error:",err));

// app.use("/api/admin", require("./routes/adminAuthRoutes"));
// app.use("/api/banners", bannerRoutes);
// app.use("/api/schedule", scheduleRoutes);
// app.use("/api/highlight", highlightRoutes);
// app.use("/api/live-tv", liveTvRoutes);
// app.use("/api/prematch", prematchRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/plans", planRoutes);          // 🔥 plans
// app.use("/api/subscription", require("./routes/subscriptionRoutes"));
// app.use("/api/payment", require("./routes/paymentRoutes"));



// app.listen(process.env.PORT || 9000, ()=>{
//   console.log("Server running 🔥");
// });
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================== ROUTES IMPORT ================== */
const bannerRoutes = require("./routes/bannerRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const highlightRoutes = require("./routes/highlightRoutes");
const liveTvRoutes = require("./routes/liveTvRoutes");
const prematchRoutes = require("./routes/prematchRoutes");
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");

/* ================== CORS SETUP ================== */
const allowedOrigins = [
  "https://antiquewhite-coyote-117976.hostingersite.com", // 🔥 tera frontend domain
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // postman allow

    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

/* ================== MONGODB ================== */
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("🔥 MongoDB Connected"))
.catch(err=>console.log("Mongo Error:",err));

/* ================== ROUTES ================== */
app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/banners", bannerRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/highlight", highlightRoutes);
app.use("/api/live-tv", liveTvRoutes);
app.use("/api/prematch", prematchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

/* ================== SERVER ================== */
app.listen(process.env.PORT || 9000, ()=>{
  console.log("🚀 Server running 🔥");
});
