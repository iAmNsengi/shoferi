import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Users", "Companies"],
    },
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
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "location", "system"],
      default: "text",
    },
    attachments: [{
      url: { type: String },
      filename: { type: String },
      fileType: { type: String },
      fileSize: { type: Number },
    }],
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
      address: { type: String },
    },
    readBy: [{
      user: { type: Schema.Types.ObjectId, refPath: "senderModel" },
      readAt: { type: Date, default: Date.now },
    }],
    deliveredAt: { type: Date },
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
    },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ "readBy.user": 1 });

// Virtual for conversation participants
messageSchema.virtual("participants").get(function() {
  return [this.sender, this.recipient];
});

// Method to mark message as read
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.user.toString() === userId.toString());
  if (!existingRead) {
    this.readBy.push({ user: userId });
    this.save();
  }
};

// Method to check if message is read by user
messageSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Static method to get conversation messages
messageSchema.statics.getConversation = function(conversationId, limit = 50, skip = 0) {
  return this.find({ 
    conversationId, 
    isDeleted: false 
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate("sender", "firstName lastName name profileUrl")
  .populate("recipient", "firstName lastName name profileUrl")
  .populate("replyTo", "content sender");
};

// Static method to get unread count for user
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    isDeleted: false,
    "readBy.user": { $ne: userId }
  });
};

const Messages = mongoose.model("Messages", messageSchema);

export default Messages; 