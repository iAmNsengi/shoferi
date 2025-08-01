import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["Users", "Companies"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: ["Users", "Companies"],
    },
    type: {
      type: String,
      enum: [
        "booking_request",
        "booking_accepted",
        "booking_rejected",
        "booking_completed",
        "job_application",
        "job_application_status",
        "message_received",
        "payment_received",
        "payment_failed",
        "system_alert",
        "profile_update",
        "verification_required",
        "account_suspended",
        "new_job_match",
        "driver_nearby",
        "review_received",
        "rating_updated",
        "promotion_offer",
        "maintenance_alert",
        "security_alert"
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    category: {
      type: String,
      enum: ["booking", "job", "message", "payment", "system", "security"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: { type: Date },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: { type: Date },
    deliveryChannels: [{
      type: String,
      enum: ["in_app", "email", "sms", "push"],
      default: ["in_app"],
    }],
    expiresAt: { type: Date },
    actionUrl: { type: String },
    actionText: { type: String },
    badge: { type: Number, default: 1 },
    sound: { type: String },
    image: { type: String },
    groupId: { type: String }, // For grouping related notifications
    isSilent: { type: Boolean, default: false },
    metadata: {
      source: { type: String },
      version: { type: String },
      deviceInfo: { type: String },
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for notification age
notificationSchema.virtual("age").get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function(channel = "in_app") {
  if (!this.isDelivered) {
    this.isDelivered = true;
    this.deliveredAt = new Date();
    if (!this.deliveryChannels.includes(channel)) {
      this.deliveryChannels.push(channel);
    }
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
    expiresAt: { $exists: false },
  });
};

// Static method to get notifications for user
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type = null,
    category = null,
  } = options;

  const query = {
    recipient: userId,
    expiresAt: { $exists: false },
  };

  if (unreadOnly) {
    query.isRead = false;
  }

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender", "firstName lastName name profileUrl");
};

// Static method to mark all notifications as read for user
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

// Static method to delete old notifications
notificationSchema.statics.cleanupOldNotifications = function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true,
  });
};

// Static method to create notification
notificationSchema.statics.createNotification = function(notificationData) {
  const notification = new this(notificationData);
  return notification.save();
};

// Pre-save middleware to set default values
notificationSchema.pre("save", function(next) {
  if (this.isNew && !this.expiresAt) {
    // Set default expiration to 30 days
    this.expiresAt = new Date();
    this.expiresAt.setDate(this.expiresAt.getDate() + 30);
  }
  next();
});

const Notifications = mongoose.model("Notifications", notificationSchema);

export default Notifications; 