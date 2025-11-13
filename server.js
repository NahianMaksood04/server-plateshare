// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');
const admin = require('./firebaseAdmin'); // Firebase Admin

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',        // local frontend
      'https://plate-share.surge.sh', // deployed frontend
    ],
    credentials: true,
  })
);

app.use(express.json()); // Body parser

// Routes
app.use('/api/foods', foodRoutes);
app.use('/api/requests', requestRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('PlateShare Backend API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
