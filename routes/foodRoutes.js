const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('foodImage'), foodController.addFood);
router.get('/', foodController.getAvailableFoods);
router.get('/featured', foodController.getFeaturedFoods);
router.get('/manage', verifyToken, foodController.getManageMyFoods);
router.get('/:id', verifyToken, foodController.getFoodDetails);
router.put('/:id', verifyToken, upload.single('foodImage'), foodController.updateFood);
router.delete('/:id', verifyToken, foodController.deleteFood);

module.exports = router;
