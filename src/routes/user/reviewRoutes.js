import express from "express";
import {
  addReview,
  getProductReviews,
  getUserReviews,
  getAllReviews,
} from "../../controllers/reviewController.js";
import protect from "../../middleware/userAuthMiddleware.js";

const router = express.Router();

// 👤 PUBLIC -> Get reviews for a product
router.get("/product/:productId", getProductReviews);

// 👤 PROTECTED -> Add a review
router.post("/", protect, addReview);

// 👤 PROTECTED -> Get user's own reviews
router.get("/my-reviews", protect, getUserReviews);

// 👤 PUBLIC -> Get all reviews (for testimonials)
router.get("/", getAllReviews);

export default router;
