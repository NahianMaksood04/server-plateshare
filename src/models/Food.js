const mongoose = require("mongoose");
const { FOOD_STATUS } = require("../utils/constants");

const FoodSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true, trim: true },
    foodImage: { type: String, required: true },
    foodQuantity: { type: Number, required: true, min: 1 },
    pickupLocation: { type: String, required: true },
    expireDate: { type: Date, required: true },
    notes: { type: String, default: "" },

    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true, index: true },
    donorPhoto: { type: String, default: "" },

    food_status: {
      type: String,
      enum: Object.values(FOOD_STATUS),
      default: FOOD_STATUS.AVAILABLE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);
