const admin = require("firebase-admin");

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();

  let credentials;
  if (process.env.FIREBASE_ADMIN_SDK_CONFIG) {
    credentials = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
  } else {
    credentials = require("./serviceAccountKey.json");
  }

  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });

  console.log("Firebase Admin initialized ✅");
  return admin.app();
}

module.exports = { initializeFirebaseAdmin };

