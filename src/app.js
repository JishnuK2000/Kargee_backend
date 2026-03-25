import express from "express";
import "./config/env.js"; // ✅ load env FIRST
import cors from "cors";
import connectDB from "./config/db.js";

// ✅ Import separated routes
import userProductRoutes from "./routes/user/productRoute.js";
import adminProductRoutes from "./routes/admin/productRoute.js";
import adminAuthRoutes from "./routes/admin/authRoutes.js";

import categoryRoutes from "./routes/admin/categoryRoutes.js";
import collectionRoutes from "./routes/admin/collectionRoute.js";
import userOrderRoutes from "./routes/user/orderRoutes.js";
import adminOrderRoutes from "./routes/admin/orderRoutes.js";
import userAuthRoutes from "./routes/user/authRoutes.js";
import userRoutes from "./routes/admin/userRoute.js"
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());

// 👤 USER ROUTES (public)
app.use("/api/user", userAuthRoutes);

app.use("/api/products", userProductRoutes);
app.use("/api/orders", userOrderRoutes);

// 🛠️ ADMIN ROUTES
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", userRoutes);



// ✅ Test route
app.get("/", (req, res) => {
  res.send("Kargee Backend Running 🚀");
});

export default app;
