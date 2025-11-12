// backend/models/Request.js
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  requester_name: { type: String, required: true },
  requester_email: { type: String, required: true },
  requester_image: { type: String },
  location: { type: String, required: true },
  reason: { type: String, required: true },
  contact_no: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
