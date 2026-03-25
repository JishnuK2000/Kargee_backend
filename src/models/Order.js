import mongoose from "mongoose";

// Reuse relevant product fields
const orderProductSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  quantity: { type: Number, required: true },
  image: { type: String }, // show product image in order summary
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    products: [orderProductSchema], // array of products
    address: addressSchema,
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"],
      default: "PLACED",
    },
    totalAmount: Number, // sum of all products
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);