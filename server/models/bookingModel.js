import mongoose, { Schema } from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Drivers", required: true },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    bookingType: {
      type: String,
      enum: ["hourly", "daily"],
      required: [true, "Booking type is required"],
    },
    totalPrice: { type: Number, required: true },
    pickupLocation: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
      address: { type: String, required: true },
    },
    dropoffLocation: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
      address: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    notes: { type: String },
    rating: {
      score: { type: Number },
      review: { type: String },
    },
  },
  { timestamps: true }
);

// Create geospatial indexes
bookingSchema.index({ pickupLocation: "2dsphere" });
bookingSchema.index({ dropoffLocation: "2dsphere" });

const Bookings = mongoose.model("Bookings", bookingSchema);

export default Bookings;
