import express from "express";
import { getUsers } from "../../controllers/userController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 ADMIN → Get all users
router.get("/get-users", authMiddleware, getUsers);

export default router;