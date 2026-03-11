const admin = require("../config/firebase");
const User = require("../models/User");

let notifications = []; // temporary storage

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
    const users = await User.find({ fcmToken: { $ne: null } });

    const tokens = users.map(user => user.fcmToken);

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

    // Debug logs
    console.log("FCM RESPONSE:", response.responses);

    // Save notification history
    notifications.push({
      title,
      message,
      time
    });

    res.json({
      message: "Notification sent",
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
