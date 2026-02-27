require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const bannerRoutes = require("./routes/bannerRoutes");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("🔥 MongoDB Connected"))
.catch(err=>console.log("Mongo Error:",err));

app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/banners", bannerRoutes);

app.listen(process.env.PORT || 9000, ()=>{
  console.log("Server running 🔥");
});