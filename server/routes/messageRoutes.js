import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getConversation,
  getConversations,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(userAuth);

// Send a message
router.post("/send", sendMessage);

// Get conversation messages
router.get("/conversation/:conversationId", getConversation);

// Get user conversations list
router.get("/conversations", getConversations);

// Mark message as read
router.put("/read/:messageId", markMessageAsRead);

// Delete message
router.delete("/:messageId", deleteMessage);

// Get unread message count
router.get("/unread/count", getUnreadCount);

export default router;
