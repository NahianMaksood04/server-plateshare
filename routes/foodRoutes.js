// backend/routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', foodController.getAllAvailableFoods);
router.get('/featured', foodController.getFeaturedFoods);
router.get('/:id', authMiddleware, foodController.getFoodById); // details require private route per spec

// Private routes (require auth)
router.post('/', authMiddleware, foodController.createFood);
router.get('/my/foods', authMiddleware, foodController.getFoodsByDonator);
router.patch('/:id', authMiddleware, foodController.updateFood);
router.delete('/:id', authMiddleware, foodController.deleteFood);

module.exports = router;
