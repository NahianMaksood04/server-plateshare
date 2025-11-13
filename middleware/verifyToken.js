const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
try {
  let serviceAccount;
  const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

  console.log(`Checking for local serviceAccountKey.json at: ${serviceAccountPath}`);

  // Prioritize local file for development
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
    console.log('Firebase Admin SDK credentials loaded from local file.');
    if (serviceAccount.private_key) {
      console.log('Private key from file (first 50 chars):', serviceAccount.private_key.substring(0, 50) + '...');
    }
  } else if (process.env.FIREBASE_ADMIN_SDK_CONFIG) {
    // Fallback to environment variable (for Vercel/production or if local file not present)
    console.log('Local serviceAccountKey.json not found. Checking FIREBASE_ADMIN_SDK_CONFIG environment variable.');
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
    console.log('Firebase Admin SDK credentials loaded from environment variable.');
    if (serviceAccount.private_key) {
      console.log('Private key from env (first 50 chars):', serviceAccount.private_key.substring(0, 50) + '...');
    }
  } else {
    throw new Error('Firebase Admin SDK credentials not found. Please set FIREBASE_ADMIN_SDK_CONFIG environment variable or create serviceAccountKey.json.');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  // Exit process if Firebase Admin SDK fails to initialize
  process.exit(1);
}


const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1];

  if (!idToken) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach user information to the request object
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token, authorization denied.' });
  }
};

module.exports = verifyToken;
