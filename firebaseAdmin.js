// firebaseAdmin.js
const admin = require("firebase-admin");

const initializeFirebaseAdmin = () => {
  try {
    if (admin.apps.length === 0) {
      let serviceAccount;

      if (process.env.FIREBASE_ADMIN_SDK_CONFIG) {
        // Parse the environment variable JSON safely
        serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
        console.log("Loaded Firebase config from environment variable.");
      } else {
        // Fallback for local testing
        serviceAccount = require("./serviceAccountKey.json");
        console.log("Loaded Firebase config from local file.");
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log("✅ Firebase Admin SDK initialized successfully.");
    }
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error.message);
    console.error(error);
    process.exit(1);
  }
};

module.exports = { initializeFirebaseAdmin };
