const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const verifyToken = require('../middleware/verifyToken');

// @route   POST api/foods
// @desc    Add a new food item
// @access  Private
router.post('/', verifyToken, foodController.addFood);

// @route   GET api/foods
// @desc    Get all available food items
// @access  Public
router.get('/', foodController.getAvailableFoods);

// @route   GET api/foods/featured
// @desc    Get 6 featured food items (highest quantity)
// @access  Public
router.get('/featured', foodController.getFeaturedFoods);

// @route   GET api/foods/manage
// @desc    Get food items added by the currently logged-in user
// @access  Private
router.get('/manage', verifyToken, foodController.getManageMyFoods);

// @route   GET api/foods/:id
// @desc    Get a single food item by ID
// @access  Private (requires login to view details)
router.get('/:id', verifyToken, foodController.getFoodDetails);

// @route   PUT api/foods/:id
// @desc    Update a food item by ID
// @access  Private
router.put('/:id', verifyToken, foodController.updateFood);

// @route   DELETE api/foods/:id
// @desc    Delete a food item by ID
// @access  Private
router.delete('/:id', verifyToken, foodController.deleteFood);

module.exports = router;
