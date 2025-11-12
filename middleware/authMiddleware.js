// backend/middleware/authMiddleware.js
const initFirebaseAdmin = require('../config/firebaseAdmin');
let admin;
try {
  admin = initFirebaseAdmin();
} catch (err) {
  // If firebase can't initialize (e.g., env not set), we'll catch later on requests.
  console.warn('Firebase Admin init warning:', err.message);
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const idToken = authHeader.split(' ')[1];
    if (!admin) {
      admin = initFirebaseAdmin();
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Attach minimal user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture
    };
    next();
  } catch (error) {
    console.error('authMiddleware error:', error);
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
};

module.exports = authMiddleware;
