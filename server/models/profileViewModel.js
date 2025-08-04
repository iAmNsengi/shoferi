import mongoose, { Schema } from "mongoose";

const profileViewSchema = new mongoose.Schema(
  {
    driver: { type: Schema.Types.ObjectId, ref: "Drivers", required: true },
    viewer: { type: Schema.Types.ObjectId, ref: "Users" }, // Can be null for anonymous views
    viewedAt: { type: Date, default: Date.now },
    source: {
      type: String,
      enum: ["job_search", "company_dashboard", "direct_link", "search_result"],
      default: "direct_link",
    },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

// Indexes for better performance
profileViewSchema.index({ driver: 1, viewedAt: -1 });
profileViewSchema.index({ viewedAt: -1 });
profileViewSchema.index({ source: 1 });

const ProfileView = mongoose.model("ProfileView", profileViewSchema);

export default ProfileView;
