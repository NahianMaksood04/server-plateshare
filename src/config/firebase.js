const axios = require("axios");
const jwt = require("jsonwebtoken");
const { projectId, issuer, certsUrl } = require("../config/firebase");

let cachedCerts = null;
let cachedAt = 0;
let cacheMaxAgeMs = 60 * 60 * 1000; // 1 hour

// Fetch and cache Google's public certificates for Firebase token verification
const getGoogleCertificates = async () => {
  const now = Date.now();

  // Return cached certs if still valid
  if (cachedCerts && now - cachedAt < cacheMaxAgeMs) {
    return cachedCerts;
  }

  // Fetch new certs
  const res = await axios.get(certsUrl, { timeout: 5000 });
  cachedCerts = res.data;

  // Update cache max age based on response headers
  const cacheControl = res.headers["cache-control"];
  if (cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/);
    if (match) cacheMaxAgeMs = parseInt(match[1], 10) * 1000;
  }

  cachedAt = now;
  return cachedCerts;
};

// Middleware to verify Firebase ID token from "Authorization: Bearer <token>"
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Decode token header to find the key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      return res.status(401).json({ message: "Invalid token header" });
    }

    const kid = decodedHeader.header.kid;
    const certs = await getGoogleCertificates();
    const publicKey = certs[kid];

    if (!publicKey) {
      return res.status(401).json({ message: "Invalid token key" });
    }

    // Verify the token using Firebase public key
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer,
    });

    // Attach verified user info to the request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyFirebaseToken;
