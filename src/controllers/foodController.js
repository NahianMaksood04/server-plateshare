const Food = require("../models/Food");
const { FOOD_STATUS } = require("../utils/constants");

exports.getFeaturedFoods = async (req, res) => {
  try {
    const foods = await Food.find({ food_status: FOOD_STATUS.AVAILABLE })
      .sort({ foodQuantity: -1, createdAt: -1 })
      .limit(6);
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const status = req.query.status || FOOD_STATUS.AVAILABLE;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "100", 10);
    const skip = (page - 1) * limit;

    const query = { food_status: status };
    const [items, total] = await Promise.all([
      Food.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Food.countDocuments(query),
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createFood = async (req, res) => {
  try {
    const { foodName, foodImage, foodQuantity, pickupLocation, expireDate, notes } = req.body;

    if (!foodName || !foodImage || !foodQuantity || !pickupLocation || !expireDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const donorName = req.user.name || req.body.donorName || "Anonymous";
    const donorEmail = req.user.email || req.body.donorEmail;
    const donorPhoto = req.user.picture || req.body.donorPhoto || "";

    if (!donorEmail) return res.status(400).json({ message: "Donor email missing" });

    const food = await Food.create({
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      notes: notes || "",
      donorName,
      donorEmail,
      donorPhoto,
      food_status: FOOD_STATUS.AVAILABLE,
    });

    res.status(201).json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donorEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donorEmail !== email) return res.status(403).json({ message: "Forbidden" });

    const allowed = ["foodName", "foodImage", "foodQuantity", "pickupLocation", "expireDate", "notes", "food_status"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];

    const updated = await Food.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donorEmail !== email) return res.status(403).json({ message: "Forbidden" });

    await Food.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
