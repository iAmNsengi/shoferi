import Messages from "../models/messageModel.js";
import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";
import Notifications from "../models/notificationModel.js";
import mongoose from "mongoose";

// Generate conversation ID
const generateConversationId = (userId1, userId2) => {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

// Send message
export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, messageType = "text", attachments = [], replyTo } = req.body;
    const senderId = req.user.userId;
    const senderModel = req.user.accountType === "company" ? "Companies" : "Users";

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: "Recipient ID and content are required",
      });
    }

    const conversationId = generateConversationId(senderId, recipientId);
    const recipientModel = req.user.accountType === "company" ? "Users" : "Companies";

    const messageData = {
      sender: senderId,
      senderModel,
      recipient: recipientId,
      recipientModel,
      content,
      messageType,
      attachments,
      conversationId,
      replyTo,
    };

    const message = await Messages.create(messageData);
    await message.populate("sender", "firstName lastName name profileUrl");
    await message.populate("recipient", "firstName lastName name profileUrl");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get conversation messages
export const getConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.userId;

    if (!conversationId || !conversationId.includes("_")) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const participants = conversationId.split("_");
    if (!participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this conversation",
      });
    }

    const skip = (page - 1) * limit;
    const messages = await Messages.getConversation(conversationId, parseInt(limit), skip);

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Messages.countDocuments({ conversationId, isDeleted: false }),
        },
      },
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get conversation",
      error: error.message,
    });
  }
};

// Get user conversations list
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const conversations = await Messages.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { recipient: mongoose.Types.ObjectId(userId) },
          ],
          isDeleted: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recipient", mongoose.Types.ObjectId(userId)] },
                    { $not: { $in: [mongoose.Types.ObjectId(userId), "$readBy.user"] } },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const populatedConversations = await Messages.populate(conversations, [
      {
        path: "lastMessage.sender",
        select: "firstName lastName name profileUrl",
        model: "Users",
      },
      {
        path: "lastMessage.recipient",
        select: "firstName lastName name profileUrl",
        model: "Companies",
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        conversations: populatedConversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get conversations",
      error: error.message,
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Messages.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await message.markAsRead(userId);

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark message as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
      error: error.message,
    });
  }
};

// Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Messages.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only sender can delete message",
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.deletedBy = userId;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const count = await Messages.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
}; 