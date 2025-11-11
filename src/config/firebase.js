const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "plate-share-70dc7",
  issuer: null,
  certsUrl:
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
};

// Set issuer dynamically based on projectId
firebaseConfig.issuer = `https://securetoken.google.com/${firebaseConfig.projectId}`;

module.exports = firebaseConfig;
