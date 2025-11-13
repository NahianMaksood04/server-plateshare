const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const { initializeFirebaseAdmin } = require("./firebaseAdmin");
const foodRoutes = require("./routes/foodRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

initializeFirebaseAdmin();

connectDB();

app.get("/", (req, res) => {
  res.send("🚀 PlateShare Backend is Live!");
});

app.use("/api/foods", foodRoutes);
app.use("/api/requests", requestRoutes);

app.get("/check-env", (req, res) => {
  if (!process.env.FIREBASE_ADMIN_SDK_CONFIG) {
    return res.json({
      success: false,
      message: "❌ Environment variable missing",
    });
  }

  try {
    const parsed = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
    return res.json({ success: true, keys: Object.keys(parsed) });
  } catch (err) {
    return res.json({
      success: false,
      message: "⚠️ JSON parse error",
      error: err.message,
    });
  }
});

// Global error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: err.message || "Server Error" });
});

// Only start server locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app for Vercel
module.exports = app;
