import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Users from "./models/userModel.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const existingAdmin = await Users.findOne({ email: "admin@shoferi.com" });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new Users({
      firstName: "Admin",
      lastName: "User",
      email: "admin@shoferi.com",
      password: hashedPassword,
      accountType: "admin",
      accountStatus: "active",
      emailVerified: true,
      phoneVerified: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@shoferi.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createAdminUser();
