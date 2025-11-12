const admin = require('firebase-admin');

const initializeFirebaseAdmin = () => {
  try {
    const serviceAccount = require(process.env.FIREBASE_ADMIN_SDK_CONFIG_PATH);

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
};

module.exports = { initializeFirebaseAdmin, admin };
