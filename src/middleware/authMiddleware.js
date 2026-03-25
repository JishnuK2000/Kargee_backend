import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // optional: to verify admin exists

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Optional: verify admin exists in DB
    // const admin = await Admin.findById(decoded.id);
    // if (!admin) return res.status(401).json({ message: "Admin not found" });

    req.admin = decoded; // attach decoded admin info
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;