const axios = require("axios");
const jwt = require("jsonwebtoken");
const { projectId, issuer, certsUrl } = require("../config/firebase");

// Cache for Google public keys
let cachedCerts = null;
let cachedAt = 0;
let cacheMaxAgeMs = 60 * 60 * 1000; // default 1 hour

// Fetch Google's public certificates
const getGoogleCertificates = async () => {
  const now = Date.now();
  if (cachedCerts && now - cachedAt < cacheMaxAgeMs) return cachedCerts;

  const res = await axios.get(certsUrl, { timeout: 5000 });
  cachedCerts = res.data;

  const cacheControl = res.headers["cache-control"];
  if (cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/);
    if (match) cacheMaxAgeMs = parseInt(match[1], 10) * 1000;
  }

  cachedAt = now;
  return cachedCerts;
};

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader?.header?.kid) return res.status(401).json({ message: "Invalid token" });

    const kid = decodedHeader.header.kid;
    const certs = await getGoogleCertificates();
    const publicKey = certs[kid];

    if (!publicKey) return res.status(401).json({ message: "Invalid token key" });

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer,
    });

    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    console.error("Token verify error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyFirebaseToken;
