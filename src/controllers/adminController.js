import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/env.js";

// Generate Access Token (Short-lived)
const generateAccessToken = (adminId) =>
  jwt.sign({ id: adminId, role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

// Generate Refresh Token (Long-lived)
const generateRefreshToken = (adminId) =>
  jwt.sign({ id: adminId, role: "admin" }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

// 🔑 Register Admin (run once)
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: "Admin created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    admin.refreshToken = refreshToken;
    await admin.save();

    res.json({
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Refresh Token Controller
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token required" });

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(admin._id);
    res.json({ accessToken });
  } catch (err) {
    console.error("Admin Refresh Token Error:", err);
    res.status(403).json({ message: "Expired or invalid refresh token" });
  }
};
