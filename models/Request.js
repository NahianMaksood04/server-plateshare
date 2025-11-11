import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    user: {
      name: String,
      email: String,
      photoURL: String,
    },
    location: { type: String, required: true },
    reason: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export default mongoose.model("Request", requestSchema);
