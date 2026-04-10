import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    desktopImageUrl: {
      type: String,
      required: true,
    },
    mobileImageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    link: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Carousel = mongoose.model("Carousel", carouselSchema);

export default Carousel;
