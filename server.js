const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://plate-share.surge.sh'], // Allow your frontend origins
  credentials: true,
}));
app.use(express.json()); // Body parser

// Define Routes
app.use('/api/foods', foodRoutes);
app.use('/api/requests', requestRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('PlateShare Backend API is running...');
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
