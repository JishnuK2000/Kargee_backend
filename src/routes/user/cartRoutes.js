import express from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  mergeCart,
} from "../../controllers/cartController.js";
import  protect  from "../../middleware/userAuthMiddleware.js";

const router = express.Router();
router.get("/", protect, getCart);              // Get user cart
router.post("/add", protect, addToCart);       // Add item
router.put("/update/:id", protect, updateCart); // Update quantity
router.delete("/remove/:id", protect, removeFromCart); // Remove item
router.post("/merge", protect, mergeCart);     // Merge local cart

export default router;