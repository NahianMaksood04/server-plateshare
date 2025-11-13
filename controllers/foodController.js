const Food = require("../models/Food");
const uploadToImgBB = require("../utils/imgbbUpload");

exports.addFood = async (req, res) => {
  try {
    const {
      foodName,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
    } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Food image is required." });

    const foodImage = await uploadToImgBB(req.file);

    const donatorName = req.user.name || req.user.email;
    const donatorEmail = req.user.email;
    const donatorImage = req.user.picture || null;

    const newFood = new Food({
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
      donatorName,
      donatorEmail,
      donatorImage,
      foodStatus: "Available",
    });

    const food = await newFood.save();
    res.status(201).json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAvailableFoods = async (req, res) => {
  try {
    const foods = await Food.find({ foodStatus: "Available" }).sort({
      createdAt: -1,
    });
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getFeaturedFoods = async (req, res) => {
  try {
    const featuredFoods = await Food.find({ foodStatus: "Available" })
      .sort({ foodQuantity: -1 })
      .limit(6);
    res.json(featuredFoods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getFoodDetails = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getManageMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donatorEmail: req.user.email }).sort({
      createdAt: -1,
    });
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateFood = async (req, res) => {
  try {
    const {
      foodName,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
    } = req.body;

    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donatorEmail !== req.user.email)
      return res.status(401).json({ message: "Not authorized" });

    food.foodName = foodName || food.foodName;
    food.foodQuantity = foodQuantity || food.foodQuantity;
    food.pickupLocation = pickupLocation || food.pickupLocation;
    food.expireDate = expireDate || food.expireDate;
    food.additionalNotes = additionalNotes || food.additionalNotes;

    if (req.file) {
      food.foodImage = await uploadToImgBB(req.file);
    }

    await food.save();
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donatorEmail !== req.user.email)
      return res.status(401).json({ message: "Not authorized" });

    await Food.deleteOne({ _id: req.params.id });
    res.json({ message: "Food removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
