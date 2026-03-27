import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "../../controllers/orderController.js";
import protect from "../../middleware/userAuthMiddleware.js";
const router = express.Router();

// 👤 USER → Place order
router.post("/", protect, createOrder);
router.get("/user/:userId", protect, getOrdersByUserId);
router.get("/:id", protect, getOrderById);

export default router;
