// const admin = require("firebase-admin");

// const serviceAccount = require("../firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// module.exports = admin;
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../firebase-service-account.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
