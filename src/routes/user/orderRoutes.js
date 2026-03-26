import express from "express";
import { createOrder } from "../../controllers/orderController.js";
import protect from "../../middleware/userAuthMiddleware.js";
const router = express.Router();

// 👤 USER → Place order
router.post("/",protect, createOrder);

export default router;