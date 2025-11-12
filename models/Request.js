const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  requesterEmail: { type: String, required: true },
  requesterName: { type: String, required: true },
  requesterPhoto: { type: String },
  requestLocation: { type: String, required: true },
  requestReason: { type: String, required: true },
  contactNo: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
