require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const bannerRoutes = require("./routes/bannerRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const highlightRoutes = require("./routes/highlightRoutes");
const liveTvRoutes = require("./routes/liveTvRoutes");
const prematchRoutes = require("./routes/prematchRoutes");
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("🔥 MongoDB Connected"))
.catch(err=>console.log("Mongo Error:",err));

app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/banners", bannerRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/highlight", highlightRoutes);
app.use("/api/live-tv", liveTvRoutes);
app.use("/api/prematch", prematchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);          // 🔥 plans
app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));



app.listen(process.env.PORT || 9000, ()=>{
  console.log("Server running 🔥");
});
