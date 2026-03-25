import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../controllers/productController.js";

import upload from "../../middleware/upload.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// 👤 PUBLIC ROUTES
router.get("/", getProducts); // Get all
router.get("/:id", getProductById); // Get one

// 🛠️ ADMIN PROTECTED ROUTES
router.post("/", authMiddleware, upload.array("images", 5), addProduct);
router.put("/:id", authMiddleware, upload.array("images", 5), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
