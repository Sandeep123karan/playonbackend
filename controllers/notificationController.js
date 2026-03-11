const admin = require("../config/firebase");
const User = require("../models/User");

let notifications = []; // temporary memory storage

// ================= SEND NOTIFICATION =================
const sendNotificationToAll = async (req, res) => {
  try {

    const { title, message } = req.body;

    const users = await User.find({ fcmToken: { $ne: null } });

    const tokens = users.map(user => user.fcmToken);

    if (tokens.length === 0) {
      return res.json({ message: "No FCM tokens found" });
    }

    const time = new Date().toISOString();

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title,
        body: message
      },
      data: {
        time
      }
    });

    // Save notification history
    notifications.push({
      title,
      message,
      time
    });

    res.json({
      message: "Notification sent",
      successCount: response.successCount,
      failureCount: response.failureCount,
      time
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ================= GET NOTIFICATIONS =================
const getNotifications = async (req, res) => {

  res.json({
    total: notifications.length,
    notifications
  });

};


module.exports = {
  sendNotificationToAll,
  getNotifications
};
