import express from "express";
import { sendOtp, verifyOtp, updateProfile } from "../../controllers/userController.js";
import protect from "../../middleware/userAuthMiddleware.js";

const router = express.Router();

router.post("/auth/send-otp", sendOtp);        // request OTP
router.post("/auth/verify-otp", verifyOtp);    // verify OTP & get JWT
router.put("/profile", protect, updateProfile); // update profile, JWT protected

export default router;