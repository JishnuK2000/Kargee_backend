import express from "express";
import {
  addCarousel,
  deleteCarousel,
  addOrUpdateHomeGrid,
  deleteHomeGrid,
} from "../../controllers/homeController.js";
import upload from "../../middleware/upload.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// Carousel management
router.post(
  "/carousel",
  authMiddleware,
  upload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  addCarousel
);
router.delete("/carousel/:id", authMiddleware, deleteCarousel);

// HomeGrid management (4grid)
router.post("/4grid", authMiddleware, upload.single("image"), addOrUpdateHomeGrid);
router.delete("/4grid/:id", authMiddleware, deleteHomeGrid);

export default router;
