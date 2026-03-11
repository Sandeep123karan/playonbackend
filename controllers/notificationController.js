const admin = require("../config/firebase");
const User = require("../models/User");

let notifications = [];

// ================= SEND NOTIFICATION =================
const sendNotificationToAll = async (req, res) => {
  try {

    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required"
      });
    }

    // Get users with FCM token
    const users = await User.find({
      fcmToken: { $exists: true, $ne: null }
    });

    // Extract tokens
    let tokens = users.map(user => user.fcmToken);

    // Remove duplicates
    tokens = [...new Set(tokens)];

    if (tokens.length === 0) {
      return res.json({
        message: "No FCM tokens found"
      });
    }

    const time = new Date().toISOString();

    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokens,
      notification: {
        title: title,
        body: message
      },
      data: {
        time: time
      },
      android: {
        priority: "high"
      }
    });

    // Debug errors
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.log("FCM Error for token:", tokens[idx]);
        console.log(resp.error);
      }
    });

    // Save notification history
    notifications.push({
      title,
      message,
      time
    });

    res.json({
      message: "Notification processed",
      totalTokens: tokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
      time
    });

  } catch (error) {

    console.error("Notification Error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};


// ================= GET NOTIFICATIONS =================
const getNotifications = async (req, res) => {
  try {

    res.json({
      total: notifications.length,
      notifications
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  sendNotificationToAll,
  getNotifications
};
