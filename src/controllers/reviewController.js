import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ✅ ADD A REVIEW
export const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, reviewTitle, reviewText } = req.body;
    const userId = req.user._id;

    // 1. Validate required fields
    if (!productId || !orderId || !rating || !reviewText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // 2. Validate that the order belongs to the user and is delivered (optional but recommended)
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or does not belong to user" });
    }

    // Check if the order is delivered
    if (order.status !== "DELIVERED") {
      return res.status(400).json({ message: "You can only review products from delivered orders" });
    }

    // 3. Validate that the product is actually in this order
    const productInOrder = order.products.find(p => p.productId === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: "Product not found in this order" });
    }

    // 4. Check if a review already exists for this exact purchase
    const existingReview = await Review.findOne({ user: userId, productId, orderId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product from this order" });
    }

    // 5. Create and save the review
    const review = await Review.create({
      user: userId,
      productId,
      orderId,
      rating: Number(rating),
      reviewTitle,
      reviewText,
    });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET REVIEWS FOR A SPECIFIC PRODUCT
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("user", "name") // Assuming User schema has 'name'
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.json({ reviews: [], averageRating: 0, totalReviews: 0 });
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    res.json({
      reviews,
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER'S REVIEWS
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ user: userId })
      .populate("orderId", "status createdAt")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error("Get User Reviews Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ GET ALL REVIEWS (Public - For Home Page Testimonials)
export const getAllReviews = async (req, res) => {
  try {
    // Fetch latest 10 reviews with high ratings (optional filter)
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ reviews });
  } catch (error) {
    console.error("Get All Reviews Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
