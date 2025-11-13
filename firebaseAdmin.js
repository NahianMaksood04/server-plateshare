const admin = require('firebase-admin');

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
} catch (err) {
  console.error('Failed to parse Firebase Admin SDK config:', err);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully!');
}

module.exports = admin;
