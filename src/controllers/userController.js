import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

// Send OTP
// export const sendOtp = async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     if (!mobile) return res.status(400).json({ message: "Mobile number required" });

//     let user = await User.findOne({ mobile });
//     if (!user) user = await User.create({ mobile, name: "Guest User" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     console.log(otp,"?????????????????????????????????????????")
//     user.otp = await bcrypt.hash(otp, 10); // store hashed OTP
//     user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
//     await user.save();

//     console.log(`OTP for ${mobile}: ${otp}`); // replace with SMS gateway
//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile)
      return res.status(400).json({ message: "Mobile number required" });

    let user = await User.findOne({ mobile });
    if (!user) user = await User.create({ mobile, name: "Guest User" });
    const otp = "123456";
    user.otp = await bcrypt.hash(otp, 10); // store hashed OTP
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    console.log(`OTP for ${mobile}: ${otp}`); // replace with SMS gateway
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });
    if (!user || !user.otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const validOtp = await bcrypt.compare(otp, user.otp);
    if (!validOtp) return res.status(400).json({ message: "Invalid OTP" });

    const token = generateToken(user._id);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, profilePicture, addresses } = req.body;
    const user = req.user; // set by userAuthMiddleware
    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    if (addresses) user.addresses = addresses;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ ADMIN: Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-otp -otpExpires") // 🔐 hide sensitive fields
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};