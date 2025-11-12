// backend/models/Food.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  food_image: { type: String, required: true }, // URL from imgbb (frontend uploads)
  food_quantity: { type: String, required: true }, // e.g., "Serves 5 people"
  pickup_location: { type: String, required: true },
  expire_date: { type: Date, required: true },
  additional_notes: { type: String },

  // Donator info (auto-filled from Firebase user)
  donator_name: { type: String, required: true },
  donator_email: { type: String, required: true },
  donator_image: { type: String },

  food_status: {
    type: String,
    enum: ['Available', 'Requested', 'Donated', 'Expired'],
    default: 'Available'
  },

  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);
