const express = require("express");
const {
  getFeaturedFoods,
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getMyFoods,
} = require("../controllers/foodController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

// Static routes first
router.get("/featured", getFeaturedFoods);
router.get("/me/mine", verifyFirebaseToken, getMyFoods);

// Dynamic / general routes after
router.get("/", getFoods);
router.get("/:id", getFoodById);

router.post("/", verifyFirebaseToken, createFood);
router.patch("/:id", verifyFirebaseToken, updateFood);
router.delete("/:id", verifyFirebaseToken, deleteFood);

module.exports = router;
