import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewTitle: {
      type: String,
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent multiple reviews for the same product in the same order by the same user
reviewSchema.index({ user: 1, productId: 1, orderId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
