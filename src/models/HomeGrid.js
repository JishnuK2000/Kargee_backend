import mongoose from "mongoose";

const homeGridSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const HomeGrid = mongoose.model("HomeGrid", homeGridSchema);

export default HomeGrid;
