const Food = require('../models/Food');

// @route   POST api/foods
// @desc    Add a new food item
// @access  Private
exports.addFood = async (req, res) => {
  try {
    const {
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
    } = req.body;

    // Donator info comes from the authenticated user
    const donatorName = req.user.name || req.user.email; // Use name if available, else email
    const donatorEmail = req.user.email;
    const donatorImage = req.user.picture || null; // Firebase user photoURL

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
      foodStatus: 'Available', // Default status
    });

    const food = await newFood.save();
    res.status(201).json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/foods
// @desc    Get all available food items
// @access  Public
exports.getAvailableFoods = async (req, res) => {
  try {
    const foods = await Food.find({ foodStatus: 'Available' }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/foods/featured
// @desc    Get 6 featured food items (highest quantity)
// @access  Public
exports.getFeaturedFoods = async (req, res) => {
  try {
    const featuredFoods = await Food.find({ foodStatus: 'Available' })
      .sort({ foodQuantity: -1 }) // Sort by quantity descending
      .limit(6); // Limit to 6 items
    res.json(featuredFoods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @route   GET api/foods/:id
// @desc    Get a single food item by ID
// @access  Private (as per requirements, redirect to login if not logged in)
exports.getFoodDetails = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   GET api/foods/manage
// @desc    Get food items added by the currently logged-in user
// @access  Private
exports.getManageMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donatorEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/foods/:id
// @desc    Update a food item by ID
// @access  Private
exports.updateFood = async (req, res) => {
  try {
    const {
      foodName,
      foodImage,
      foodQuantity,
      pickupLocation,
      expireDate,
      additionalNotes,
    } = req.body;

    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Ensure user is the donator
    if (food.donatorEmail.toString() !== req.user.email) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    food.foodName = foodName || food.foodName;
    food.foodImage = foodImage || food.foodImage;
    food.foodQuantity = foodQuantity || food.foodQuantity;
    food.pickupLocation = pickupLocation || food.pickupLocation;
    food.expireDate = expireDate || food.expireDate;
    food.additionalNotes = additionalNotes || food.additionalNotes;

    await food.save();
    res.json(food);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/foods/:id
// @desc    Delete a food item by ID
// @access  Private
exports.deleteFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Ensure user is the donator
    if (food.donatorEmail.toString() !== req.user.email) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Food.deleteOne({ _id: req.params.id });
    res.json({ message: 'Food removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(500).send('Server Error');
  }
};
