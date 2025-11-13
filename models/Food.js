const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  foodImage: {
    type: String,
    required: true,
  },
  foodQuantity: {
    type: Number,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
  additionalNotes: {
    type: String,
  },
  donatorName: {
    type: String,
    required: true,
  },
  donatorEmail: {
    type: String,
    required: true,
  },
  donatorImage: {
    type: String,
  },
  foodStatus: {
    type: String,
    enum: ['Available', 'Donated'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Food', FoodSchema);
