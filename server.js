// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeFirebaseAdmin } = require("./firebaseAdmin");
const foodRoutes = require("./routes/foodRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Initialize Firebase
initializeFirebaseAdmin();

// Routes
// Use singular and plural versions for clarity
app.use("/api/food", foodRoutes);
app.use("/api/foods", foodRoutes); // optional: for /api/foods
app.use("/api/request", requestRoutes);
app.use("/api/requests", requestRoutes); // optional: for /api/requests

// Test route to check environment variables
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

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🚀 PlateShare Backend is Live!");
});

// ✅ Required for Vercel
module.exports = app;
