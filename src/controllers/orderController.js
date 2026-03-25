import Order from "../models/Order.js";

// ✅ CREATE ORDER (User)
export const createOrder = async (req, res) => {
  try {
    const { products, address, paymentMethod } = req.body;

    // Validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !address ||
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      return res.status(400).json({ message: "Address is incomplete" });
    }

    // Indian mobile validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(address.phone)) {
      return res.status(400).json({ message: "Invalid Indian phone number" });
    }

    // Calculate totalAmount using discountPrice if available
    const totalAmount = products.reduce(
      (sum, p) => sum + (p.discountPrice || p.price) * p.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      products,
      address,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL ORDERS (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};