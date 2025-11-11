const Food = require("../models/Food");
const { FOOD_STATUS } = require("../utils/constants");

// 🥗 Get 6 featured available foods (sorted by quantity & newest first)
exports.getFeaturedFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ food_status: FOOD_STATUS.AVAILABLE })
      .sort({ foodQuantity: -1, createdAt: -1 }) // fixed -0 → -1
      .limit(6);

    res.json(foods);
  } catch (err) {
    next(err);
  }
};

// 📦 Get paginated food list by status
exports.getFoods = async (req, res, next) => {
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
    next(err);
  }
};

// 🔍 Get single food item by ID
exports.getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    next(err);
  }
};

// ➕ Create a new food donation
exports.createFood = async (req, res, next) => {
  try {
    const {
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !foodName ||
      !foodImage ||
      !foodQuantity ||
      !pickupLocation ||
      !expireDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get donor info (from Firebase token or request body)
    const donorName =
      req.user.name || req.user.user_name || req.body.donorName || "Anonymous";
    const donorEmail = req.user.email || req.body.donorEmail;
    const donorPhoto = req.user.picture || req.body.donorPhoto || "";

    if (!donorEmail) {
      return res.status(400).json({ message: "Donor email missing" });
    }

    // Create new food document
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
    next(err);
  }
};

// 👤 Get all foods created by the logged-in donor
exports.getMyFoods = async (req, res, next) => {
  try {
    const email = req.user.email;
    const foods = await Food.find({ donorEmail: email }).sort({
      createdAt: -1,
    });
    res.json(foods);
  } catch (err) {
    next(err);
  }
};

// ✏️ Update an existing food (only by its owner)
exports.updateFood = async (req, res, next) => {
  try {
    const id = req.params.id;
    const email = req.user.email;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donorEmail !== email)
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot edit this food" });

    const allowed = [
      "foodName",
      "foodImage",
      "foodQuantity",
      "pickupLocation",
      "expireDate",
      "notes",
      "food_status",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updated = await Food.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete a food (only by its owner)
exports.deleteFood = async (req, res, next) => {
  try {
    const id = req.params.id;
    const email = req.user.email;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donorEmail !== email)
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this food" });

    await Food.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
