import express from "express";
import { createTicket, getUserTickets } from "../../controllers/supportController.js";
import protect from "../../middleware/userAuthMiddleware.js";

const router = express.Router();

// 👤 PROTECTED -> Create a support ticket (Complaint or Return Request)
router.post("/tickets", protect, createTicket);

// 👤 PROTECTED -> Get user's own tickets
router.get("/my-tickets", protect, getUserTickets);

export default router;
