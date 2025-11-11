import Food from "../models/Food.js";

export const addFood = async (req, res) => {
  try {
    const newFood = new Food({
      ...req.body,
      donator: {
        name: req.user.name,
        email: req.user.email,
        photoURL: req.user.picture,
      },
    });
    await newFood.save();
    res.status(201).json({ message: "Food added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableFoods = async (req, res) => {
  try {
    const foods = await Food.find({ food_status: "Available" }).sort({
      quantity: -1,
    });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
