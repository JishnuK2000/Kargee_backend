// models/User.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true }, // login by mobile
  profilePicture: { type: String }, // URL or file path
  addresses: [addressSchema],       // multiple addresses
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  otp: { type: String },            // for OTP login
  otpExpires: { type: Date },       // OTP expiry
  refreshToken: { type: String },    // for refreshing access token
}, { timestamps: true });

export default mongoose.model("User", userSchema);