import express from "express";
import {
  addCategory,
  getCategories,
  deleteCategory,
} from "../../controllers/categoryController.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// 👤 PUBLIC ROUTE
router.get("/", getCategories); // get all categories

// 🛠️ ADMIN ROUTES
router.post("/", authMiddleware, addCategory); // add category
router.delete("/:id", authMiddleware, deleteCategory); // delete category

export default router;