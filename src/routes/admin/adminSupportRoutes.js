import express from "express";
import { getAllTickets, updateTicketStatus } from "../../controllers/supportController.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

// 🛠️ ADMIN PROTECTED -> Get all tickets
router.get("/", protect, getAllTickets);

// 🛠️ ADMIN PROTECTED -> Update ticket status / add response
router.put("/:id", protect, updateTicketStatus);

export default router;
