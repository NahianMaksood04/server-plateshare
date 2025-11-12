// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const initFirebaseAdmin = require('./config/firebaseAdmin'); // will throw if env not present

const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // for JSON bodies

// Connect DB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}
connectDB(mongoUri);

// Initialize Firebase Admin (throws if not configured)
try {
  initFirebaseAdmin();
  console.log('Firebase Admin initialized');
} catch (err) {
  console.warn('Firebase Admin could not initialize at startup. Ensure FIREBASE_SERVICE_ACCOUNT is set.');
}

// Routes
app.get('/', (req, res) => res.send('PlateShare Backend is up'));

app.use('/api/foods', foodRoutes);
app.use('/api/requests', requestRoutes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Error handler fallback
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
