import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    expireDate: { type: Date, required: true },
    notes: { type: String },
    donator: {
      name: String,
      email: String,
      photoURL: String,
    },
    food_status: { type: String, default: "Available" },
  },
  { timestamps: true },
);

export default mongoose.model("Food", foodSchema);
