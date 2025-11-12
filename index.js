require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');
const { initializeFirebaseAdmin } = require('./firebaseAdmin');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://plateshare-community.web.app'],
  credentials: true,
}));
app.use(express.json());

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/foods', foodRoutes);
app.use('/api/requests', requestRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('PlateShare Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
