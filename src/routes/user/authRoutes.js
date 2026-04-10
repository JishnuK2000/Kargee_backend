import express from "express";
import { sendOtp, verifyOtp, updateProfile, refreshToken } from "../../controllers/userController.js";
import protect from "../../middleware/userAuthMiddleware.js";

const router = express.Router();

router.post("/auth/send-otp", sendOtp);        // request OTP
router.post("/auth/verify-otp", verifyOtp);    // verify OTP & get JWT
router.post("/auth/refresh-token", refreshToken); // get new access token using refresh token
router.put("/profile", protect, updateProfile); // update profile, JWT protected

export default router;