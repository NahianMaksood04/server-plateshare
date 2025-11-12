
const admin = require('firebase-admin');

function initFirebaseAdmin() {
  if (admin.apps.length) return admin; 

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  let credential;
  if (serviceAccountPath) {
    credential = admin.credential.cert(require(serviceAccountPath));
  } else if (serviceAccountJson) {
    // If private_key contains escaped \n, convert them to real newlines
    let obj;
    try {
      obj = JSON.parse(serviceAccountJson);
      if (obj.private_key) obj.private_key = obj.private_key.replace(/\\n/g, '\n');
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON', e);
      throw e;
    }
    credential = admin.credential.cert(obj);
  } else {
    throw new Error('FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH must be set.');
  }

  admin.initializeApp({
    credential
  });

  return admin;
}

module.exports = initFirebaseAdmin;
