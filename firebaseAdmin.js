const admin = require("firebase-admin");

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    let serviceAccount;

    if (process.env.FIREBASE_ADMIN_SDK_CONFIG) {
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
      // Replace escaped newlines with actual newlines in the private_key
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    } else {
      // fallback for local development
      serviceAccount = require("./serviceAccountKey.json");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin initialized.");
  }
}

module.exports = { initializeFirebaseAdmin };
