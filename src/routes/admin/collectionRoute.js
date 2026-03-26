import express from "express";
import {
  addCollection,
  getCollections,
  deleteCollection,
} from "../../controllers/collectionController.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getCollections);

// ADMIN
router.post("/", authMiddleware, addCollection);
router.delete("/:id", authMiddleware, deleteCollection);

export default router;