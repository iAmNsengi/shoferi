import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Companies" },
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "temporary", "one-time"],
      required: [true, "Job Type is required"],
    },
    category: {
      type: String,
      enum: [
        "ride_sharing",
        "delivery",
        "logistics",
        "transport",
        "chauffeur",
        "moving_services",
        "tour_guide",
        "emergency_transport",
        "goods_transport",
        "passenger_transport",
      ],
      required: [true, "Job category is required"],
    },
    vehicleRequirements: {
      vehicleType: {
        type: [String],
        enum: ["sedan", "suv", "truck", "motorcycle", "bus", "van", "pickup"],
      },
      minYear: { type: Number },
      features: [String], // e.g., "air_conditioning", "gps", "cargo_space"
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    coordinates: {
      type: { 
        type: String, 
        enum: ['Point']
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function(coords) {
            return coords.length === 2;
          },
          message: 'Coordinates must contain exactly 2 elements [longitude, latitude]'
        }
      }
    },
    workRadius: { type: Number, default: 10 }, // km radius from base location
    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },
    salaryType: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly", "per_trip", "commission"],
      default: "monthly",
    },
    commission: {
      percentage: { type: Number }, // For commission-based jobs
      baseAmount: { type: Number },
    },
    schedule: {
      type: String,
      enum: ["flexible", "fixed", "shifts", "on_demand"],
      default: "flexible",
    },
    workingHours: {
      startTime: { type: String }, // e.g., "08:00"
      endTime: { type: String }, // e.g., "17:00"
      daysOfWeek: [String], // e.g., ["monday", "tuesday", ...]
    },
    vacancies: { type: Number, default: 1 },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    requirements: {
      licenseType: [String], // e.g., ["A", "B", "C"]
      minimumAge: { type: Number, default: 18 },
      languages: [String],
      skills: [String],
      background_check: { type: Boolean, default: false },
      drug_test: { type: Boolean, default: false },
    },
    benefits: [String], // e.g., ["insurance", "fuel_allowance", "maintenance"]
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["active", "paused", "closed", "filled"],
      default: "active",
    },
    details: [
      {
        desc: { type: String },
        requirements: { type: String },
      },
    ],
    applications: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Users" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "reviewed", "shortlisted", "accepted", "rejected"],
          default: "pending",
        },
        response: { type: String },
        notes: { type: String },
        interview: {
          scheduled: { type: Date },
          location: { type: String },
          type: { type: String, enum: ["in_person", "phone", "video"] },
        },
      },
    ],
    analytics: {
      views: { type: Number, default: 0 },
      applications: { type: Number, default: 0 },
      matches: { type: Number, default: 0 },
    },
    expiresAt: { type: Date },
    featured: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for better performance
// jobSchema.index({ coordinates: "2dsphere" }); // Temporarily commented out for seeding
jobSchema.index({ category: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ salary: 1 });
jobSchema.index({ experience: 1 });
jobSchema.index({ priority: 1 });
jobSchema.index({ featured: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ expiresAt: 1 });

// Virtual for application count
jobSchema.virtual("applicationCount").get(function () {
  return this.applications.length;
});

// Pre-save middleware
jobSchema.pre("save", function (next) {
  // Update analytics
  this.analytics.applications = this.applications.length;

  // Set expiration date if not provided (default 30 days)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  next();
});

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
