import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, "Company Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: true,
  },
  contact: { type: String },
  location: { type: String },
  about: { type: String },
  profileUrl: { type: String, default: "" },
  website: { type: String },
  industry: { type: String },
  companySize: { 
    type: String, 
    enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    default: "1-10"
  },
  foundedYear: { type: Number },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "Rwanda" },
    postalCode: { type: String },
  },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
  },
  accountType: {
    type: String,
    default: "company",
    immutable: true,
  },
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "pending_verification", "deactivated"],
    default: "active",
  },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
  preferences: {
    language: { type: String, default: "en" },
    currency: { type: String, default: "RWF" },
    timezone: { type: String, default: "Africa/Kigali" },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      applicationAlerts: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
  },
}, { timestamps: true });

// middelwares
companySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
companySchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
companySchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Companies = mongoose.model("Companies", companySchema);

export default Companies;
