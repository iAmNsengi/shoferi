import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Bookings", required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Drivers", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "RWF" },
    paymentMethod: {
      type: String,
      enum: ["mobile_money", "credit_card", "bank_transfer", "cash"],
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: ["mtn_momo", "airtel_money", "stripe", "paypal", "bank", "cash"],
    },
    transactionId: { type: String, unique: true },
    externalTransactionId: { type: String }, // ID from payment provider
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    paymentDetails: {
      phoneNumber: { type: String }, // For mobile money
      cardLast4: { type: String }, // For card payments
      bankAccount: { type: String }, // For bank transfers
    },
    fees: {
      platformFee: { type: Number, default: 0 },
      paymentProcessingFee: { type: Number, default: 0 },
      driverCommission: { type: Number, default: 0 },
    },
    metadata: {
      attemptCount: { type: Number, default: 1 },
      failureReason: { type: String },
      completedAt: { type: Date },
      refundedAt: { type: Date },
      refundReason: { type: String },
    },
    webhookEvents: [
      {
        event: { type: String },
        data: { type: Schema.Types.Mixed },
        receivedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better performance
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ driver: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save middleware to generate transaction ID
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  next();
});

const Payments = mongoose.model("Payments", paymentSchema);

export default Payments;
