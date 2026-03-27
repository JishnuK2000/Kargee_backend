import SupportTicket from "../models/SupportTicket.js";
import Order from "../models/Order.js";

// ✅ CREATE TICKET (User)
export const createTicket = async (req, res) => {
  try {
    const { orderId, productId, ticketType, subject, description, images } = req.body;
    const userId = req.user._id;

    if (!orderId || !ticketType || !subject || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["COMPLAINT", "RETURN_REQUEST"].includes(ticketType)) {
      return res.status(400).json({ message: "Invalid ticket type" });
    }

    // Verify order belongs to user
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or access denied" });
    }

    // If requesting return, usually order needs to be DELIVERED. 
    // We optionally enforce it here:
    if (ticketType === "RETURN_REQUEST" && order.status !== "DELIVERED") {
      return res.status(400).json({ message: "Can only request a return for delivered orders" });
    }

    // Optional: verify product is in the order if productId is provided
    if (productId) {
      const productInOrder = order.products.find(p => p.productId === productId);
      if (!productInOrder) {
        return res.status(400).json({ message: "Product not found in this order" });
      }
    }

    const ticket = await SupportTicket.create({
      user: userId,
      orderId,
      productId,
      ticketType,
      subject,
      description,
      images: images || [],
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER TICKETS
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const tickets = await SupportTicket.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (error) {
    console.error("Get User Tickets Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL TICKETS (Admin)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("user", "name email mobile")
      .populate("orderId", "status totalAmount createdAt")
      .sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (error) {
    console.error("Get All Tickets Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE TICKET STATUS (Admin)
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const validStatuses = ["PENDING", "REVIEWED", "APPROVED", "REJECTED", "RESOLVED"];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedData = {};
    if (status) updatedData.status = status;
    if (adminResponse !== undefined) updatedData.adminResponse = adminResponse;

    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket updated successfully", ticket: updatedTicket });
  } catch (error) {
    console.error("Update Ticket Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
