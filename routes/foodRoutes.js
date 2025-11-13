const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET api/foods
// @desc    Get all available foods
// @access  Public
router.get("/", foodController.getAvailableFoods);

router.get("/featured", foodController.getFeaturedFoods);

router.get("/manage", authMiddleware, foodController.getManageableFoods);

router.get("/:id", authMiddleware, foodController.getFoodById);

router.post("/", authMiddleware, foodController.addFood);

router.patch("/:id", authMiddleware, foodController.updateFood);

router.delete("/:id", authMiddleware, foodController.deleteFood);

module.exports = router;
