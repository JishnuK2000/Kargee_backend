import express from "express";
import { createOrder } from "../../controllers/orderController.js";

const router = express.Router();

// 👤 USER → Place order
router.post("/", createOrder);

export default router;