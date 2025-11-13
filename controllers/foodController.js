const Food = require("../models/Food");
exports.getAvailableFoods = async (req, res) => {
  try {
    const foods = await Food.find({ foodStatus: "Available" }).sort({
      createdAt: -1,
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getFeaturedFoods = async (req, res) => {
  try {
    const foods = await Food.find({ foodStatus: "Available" })
      .sort({ foodQuantity: -1 })
      .limit(6);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getManageableFoods = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const foods = await Food.find({ "donator.email": userEmail }).sort({
      createdAt: -1,
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addFood = async (req, res) => {
  try {
    const {
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expiredDateTime,
      additionalNotes,
    } = req.body;

    const donator = {
      name: req.user.name,
      email: req.user.email,
      image: req.user.picture,
    };

    const newFood = new Food({
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expiredDateTime,
      additionalNotes,
      donator,
      foodStatus: "Available",
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.donator.email !== req.user.email) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this food" });
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.donator.email !== req.user.email) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this food" });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
