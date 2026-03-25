import express from "express";
import {
  addCollection,
  getCollections,
} from "../../controllers/collectionController.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// 👤 PUBLIC ROUTE
router.get("/", getCollections); // get all collections

// 🛠️ ADMIN ROUTE
router.post("/", authMiddleware, addCollection); // add collection

export default router;