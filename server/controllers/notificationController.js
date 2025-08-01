import Notifications from "../models/notificationModel.js";
import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";

// Get user notifications
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, unreadOnly = false, type = null, category = null } = req.query;

    const notifications = await Notifications.getUserNotifications(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === "true",
      type,
      category,
    });

    const totalCount = await Notifications.countDocuments({
      recipient: userId,
      expiresAt: { $exists: false },
    });

    const unreadCount = await Notifications.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
        },
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notifications.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await Notifications.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notifications.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if user is the recipient
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Notifications.findByIdAndDelete(notificationId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// Get notification settings
export const getNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userModel = req.user.accountType === "company" ? Companies : Users;

    const user = await userModel.findById(userId).select("preferences");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        notifications: user.preferences?.notifications || {
          email: true,
          sms: true,
          push: true,
          jobAlerts: true,
          marketing: false,
        },
      },
    });
  } catch (error) {
    console.error("Get notification settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notification settings",
      error: error.message,
    });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { notifications } = req.body;
    const userModel = req.user.accountType === "company" ? Companies : Users;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update notification preferences
    if (!user.preferences) {
      user.preferences = {};
    }
    user.preferences.notifications = {
      ...user.preferences.notifications,
      ...notifications,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
      data: {
        notifications: user.preferences.notifications,
      },
    });
  } catch (error) {
    console.error("Update notification settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification settings",
      error: error.message,
    });
  }
};

// Create notification (internal use)
export const createNotification = async (notificationData) => {
  try {
    const notification = await Notifications.createNotification(notificationData);
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
};

// Send booking notification
export const sendBookingNotification = async (booking, type) => {
  try {
    const notificationData = {
      recipient: booking.user,
      recipientModel: "Users",
      sender: booking.driver,
      senderModel: "Users",
      type,
      category: "booking",
      data: {
        bookingId: booking._id,
        driverId: booking.driver,
        userId: booking.user,
      },
      actionUrl: `/bookings/${booking._id}`,
    };

    switch (type) {
      case "booking_request":
        notificationData.title = "New Booking Request";
        notificationData.message = "You have a new booking request";
        break;
      case "booking_accepted":
        notificationData.title = "Booking Accepted";
        notificationData.message = "Your booking request has been accepted";
        break;
      case "booking_rejected":
        notificationData.title = "Booking Rejected";
        notificationData.message = "Your booking request has been rejected";
        break;
      case "booking_completed":
        notificationData.title = "Booking Completed";
        notificationData.message = "Your booking has been completed";
        break;
    }

    await createNotification(notificationData);
  } catch (error) {
    console.error("Send booking notification error:", error);
  }
};

// Send job notification
export const sendJobNotification = async (job, type, recipientId) => {
  try {
    const notificationData = {
      recipient: recipientId,
      recipientModel: "Users",
      sender: job.company,
      senderModel: "Companies",
      type,
      category: "job",
      data: {
        jobId: job._id,
        companyId: job.company,
      },
      actionUrl: `/jobs/${job._id}`,
    };

    switch (type) {
      case "job_application":
        notificationData.title = "New Job Application";
        notificationData.message = "You have received a new job application";
        break;
      case "job_application_status":
        notificationData.title = "Application Status Updated";
        notificationData.message = "Your job application status has been updated";
        break;
      case "new_job_match":
        notificationData.title = "New Job Match";
        notificationData.message = "A new job matches your profile";
        break;
    }

    await createNotification(notificationData);
  } catch (error) {
    console.error("Send job notification error:", error);
  }
}; 