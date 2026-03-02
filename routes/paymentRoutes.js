

const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/auth");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
router.get("/test",(req,res)=>{
  res.send("payment route working 🔥");
});

router.post("/create-order", protectUser, createOrder);
router.post("/verify", protectUser, verifyPayment);

module.exports = router;
