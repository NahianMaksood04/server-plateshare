const mongoose = require("mongoose");
const { REQUEST_STATUS } = require("../utils/constants");

const RequestSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true, index: true },

    userName: { type: String, required: true },
    userEmail: { type: String, required: true, index: true },
    userPhoto: { type: String, default: "" },

    location: { type: String, required: true },
    reason: { type: String, required: true },
    contactNo: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
