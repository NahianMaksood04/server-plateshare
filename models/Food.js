const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodImage: { type: String, required: true },
  foodQuantity: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  expiredDateTime: { type: Date, required: true },
  additionalNotes: { type: String },
  foodStatus: { type: String, enum: ['Available', 'Donated'], default: 'Available' },
  donator: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
  },
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
