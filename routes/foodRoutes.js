const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/foods
// @desc    Get all available foods
// @access  Public
router.get('/', foodController.getAvailableFoods);

// @route   GET api/foods/featured
// @desc    Get featured foods (highest quantity)
// @access  Public
router.get('/featured', foodController.getFeaturedFoods);

// @route   GET api/foods/manage
// @desc    Get foods added by the logged-in user
// @access  Private
router.get('/manage', authMiddleware, foodController.getManageableFoods);

// @route   GET api/foods/:id
// @desc    Get a single food by ID
// @access  Private
router.get('/:id', authMiddleware, foodController.getFoodById);

// @route   POST api/foods
// @desc    Add a new food
// @access  Private
router.post('/', authMiddleware, foodController.addFood);

// @route   PATCH api/foods/:id
// @desc    Update a food
// @access  Private
router.patch('/:id', authMiddleware, foodController.updateFood);

// @route   DELETE api/foods/:id
// @desc    Delete a food
// @access  Private
router.delete('/:id', authMiddleware, foodController.deleteFood);

module.exports = router;
