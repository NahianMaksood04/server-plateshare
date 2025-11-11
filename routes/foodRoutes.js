import express from "express";
import {
  addFood,
  getAvailableFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addFood);
router.get("/", getAvailableFoods);
router.get("/:id", verifyToken, getFoodById);
router.patch("/:id", verifyToken, updateFood);
router.delete("/:id", verifyToken, deleteFood);

export default router;
