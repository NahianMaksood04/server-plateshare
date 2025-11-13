const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  foodImage: {
    type: String,
    required: true,
  },
  donatorEmail: {
    type: String,
    required: true,
  },
  requesterEmail: {
    type: String,
    required: true,
  },
  requesterName: {
    type: String,
    required: true,
  },
  requesterImage: {
    type: String,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  whyNeedFood: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  requestStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Request', RequestSchema);
