const express = require("express");
const router = express.Router();

const { protectUser } = require("../middleware/auth");

const {
  mySubscription,
  allSubscriptions,
  deleteSubscription
} = require("../controllers/subscriptionController");


// 👤 user check own subscription
router.get("/my", protectUser, mySubscription);

// 👑 admin all subscriptions
router.get("/all", protectUser, allSubscriptions);

// delete
router.delete("/:id", protectUser, deleteSubscription);

module.exports = router;
