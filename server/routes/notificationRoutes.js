import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Get user notifications
router.get("/", getUserNotifications);

// Mark notification as read
router.put("/read/:notificationId", markNotificationAsRead);

// Mark all notifications as read
router.put("/read-all", markAllNotificationsAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

// Get notification settings
router.get("/settings", getNotificationSettings);

// Update notification settings
router.put("/settings", updateNotificationSettings);

export default router;
