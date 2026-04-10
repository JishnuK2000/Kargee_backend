import express from "express";
import { loginAdmin, registerAdmin, refreshToken } from "../../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin); // use once
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshToken);

export default router;