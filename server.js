const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeFirebaseAdmin } = require("./firebaseAdmin");
const foodRoutes = require("./routes/foodRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Initialize Firebase
initializeFirebaseAdmin();

// Routes
app.use("/api/food", foodRoutes);
app.use("/api/request", requestRoutes);

// Test route
app.get("/check-env", (req, res) => {
  if (!process.env.FIREBASE_ADMIN_SDK_CONFIG) {
    return res.json({ success: false, message: "❌ Environment variable missing" });
  }

  try {
    const parsed = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
    return res.json({ success: true, keys: Object.keys(parsed) });
  } catch (err) {
    return res.json({ success: false, message: "⚠️ JSON parse error", error: err.message });
  }
});

// ✅ Required for Vercel
module.exports = app;

