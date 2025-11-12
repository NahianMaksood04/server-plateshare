// backend/controllers/foodController.js
const Food = require('../models/Food');
const Request = require('../models/Request');

exports.createFood = async (req, res) => {
  try {
    // req.user should be set by authMiddleware
    const {
      food_name,
      food_image,
      food_quantity,
      pickup_location,
      expire_date,
      additional_notes
    } = req.body;

    if (!food_name || !food_image || !food_quantity || !pickup_location || !expire_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newFood = new Food({
      food_name,
      food_image,
      food_quantity,
      pickup_location,
      expire_date,
      additional_notes,
      donator_name: req.user.name || 'Anonymous',
      donator_email: req.user.email,
      donator_image: req.user.picture || ''
    });

    const saved = await newFood.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error('createFood error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAvailableFoods = async (req, res) => {
  try {
    const foods = await Food.find({ food_status: 'Available' }).sort({ created_at: -1 });
    return res.json(foods);
  } catch (error) {
    console.error('getAllAvailableFoods error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    return res.json(food);
  } catch (error) {
    console.error('getFoodById error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeaturedFoods = async (req, res) => {
  try {
    // Logic: top 6 by some measure — spec says 'highest food quantity'.
    // Since food_quantity is a text like "Serves 5 people", attempt to extract a number.
    const foods = await Food.find({ food_status: 'Available' });

    const parsed = foods.map(f => {
      // try to extract digits from food_quantity
      const match = (f.food_quantity || '').match(/(\d+)/);
      const qty = match ? parseInt(match[1], 10) : 0;
      return { f, qty };
    });

    parsed.sort((a, b) => b.qty - a.qty);

    const top6 = parsed.slice(0, 6).map(p => p.f);
    return res.json(top6);
  } catch (error) {
    console.error('getFeaturedFoods error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    // Only owner can update
    if (food.donator_email !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    Object.assign(food, updates);
    const updated = await food.save();
    return res.json(updated);
  } catch (error) {
    console.error('updateFood error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    if (food.donator_email !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    await Request.deleteMany({ food: food._id }); // optional: clean requests
    await Food.findByIdAndDelete(id);
    return res.json({ message: 'Food deleted' });
  } catch (error) {
    console.error('deleteFood error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getFoodsByDonator = async (req, res) => {
  try {
    const donatorEmail = req.user.email;
    const foods = await Food.find({ donator_email: donatorEmail }).sort({ created_at: -1 });
    return res.json(foods);
  } catch (error) {
    console.error('getFoodsByDonator error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
