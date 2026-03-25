import express from "express";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../../controllers/orderController.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 ADMIN → Get all orders
router.get("/", authMiddleware, getOrders);

// 🔐 ADMIN → Get single order
router.get("/:id", authMiddleware, getOrderById);

// 🔐 ADMIN → Update status
router.put("/:id", authMiddleware, updateOrderStatus);

export default router;