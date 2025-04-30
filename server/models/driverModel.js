import mongoose, { Schema } from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
    },
    licenseType: { type: String, required: [true, "License type is required"] },
    experience: { type: Number, default: 0 },
    vehicleTypes: [{ type: String }],
    availability: {
      status: {
        type: String,
        enum: ["available", "busy", "offline"],
        default: "offline",
      },
      schedule: [
        {
          day: { type: String },
          startTime: { type: String },
          endTime: { type: String },
        },
      ],
    },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Users" },
        rating: { type: Number },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    currentLocation: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a geospatial index on the currentLocation field
driverSchema.index({ currentLocation: "2dsphere" });

const Drivers = mongoose.model("Drivers", driverSchema);

export default Drivers;
