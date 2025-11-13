const admin = require('firebase-admin');

const initializeFirebaseAdmin = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

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
