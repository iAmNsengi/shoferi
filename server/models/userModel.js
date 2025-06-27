import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    accountType: {
      type: String,
      enum: ["driver", "admin"],
      default: "driver",
    },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    cvUrl: { type: String },
    jobTitle: { type: String },
    about: { type: String },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { 
      type: String, 
      enum: ["male", "female", "other", "prefer_not_to_say"] 
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phoneNumber: { type: String },
    },
    preferences: {
      language: { type: String, default: "en" },
      currency: { type: String, default: "RWF" },
      theme: { type: String, default: "light", enum: ["light", "dark", "auto"] },
      timezone: { type: String, default: "Africa/Kigali" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        jobAlerts: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      privacy: {
        profileVisibility: { 
          type: String, 
          default: "public", 
          enum: ["public", "private", "limited"] 
        },
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: true },
      },
    },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      website: { type: String },
    },
    skills: [{ type: String }],
    experience: {
      years: { type: Number, default: 0 },
      description: { type: String },
    },
    education: [{
      institution: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      isCurrentlyStudying: { type: Boolean, default: false },
    }],
    certifications: [{
      name: { type: String },
      issuer: { type: String },
      dateIssued: { type: Date },
      expiryDate: { type: Date },
      credentialId: { type: String },
    }],
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      secret: { type: String },
      backupCodes: [{ type: String }],
    },
    loginHistory: [{
      timestamp: { type: Date, default: Date.now },
      ipAddress: { type: String },
      userAgent: { type: String },
      location: { type: String },
    }],
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "pending_verification", "deactivated"],
      default: "active",
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// middelwares
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Users = mongoose.model("Users", userSchema);

export default Users;
