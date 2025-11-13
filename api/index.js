// /api/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { initializeFirebaseAdmin } = require("../firebaseAdmin");
const foodRoutes = require("../routes/foodRoutes");
const requestRoutes = require("../routes/requestRoutes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["https://plateshare-community.web.app"], // Add your frontend URL
    credentials: true,
  })
);
app.use(express.json());

initializeFirebaseAdmin();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/foods", foodRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.send("PlateShare Server is running!");
});

module.exports = app;
