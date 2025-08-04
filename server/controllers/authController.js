import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";
import mongoose from "mongoose";

export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    accountType = "driver",
    companyName, // For company registration
    industry,
    companySize,
    website,
  } = req.body;

  console.log("Registration attempt:", {
    accountType,
    email,
    companyName,
    firstName,
    lastName,
  });

  // Basic validation
  if (!email) {
    return next("Email is required");
  }
  if (!password) {
    return next("Password is required");
  }
  if (password.length < 6) {
    return next("Password must be at least 6 characters long");
  }

  // Validate account type
  const validAccountTypes = ["driver", "admin", "company"];
  if (!validAccountTypes.includes(accountType)) {
    return next("Invalid account type. Must be driver, admin, or company");
  }

  // Validate based on account type
  if (accountType === "company") {
    if (!companyName) {
      return next("Company name is required for company registration");
    }
    if (companyName.trim().length < 2) {
      return next("Company name must be at least 2 characters long");
    }
  } else {
    if (!firstName || !firstName.trim()) {
      return next("First name is required");
    }
    if (!lastName || !lastName.trim()) {
      return next("Last name is required");
    }
    if (firstName.trim().length < 2) {
      return next("First name must be at least 2 characters long");
    }
    if (lastName.trim().length < 2) {
      return next("Last name must be at least 2 characters long");
    }
  }

  // Start transaction for proper rollback if needed
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();

    const [existingUser, existingCompany] = await Promise.all([
      Users.findOne({ email: normalizedEmail }),
      Companies.findOne({ email: normalizedEmail }),
    ]);

    if (existingUser || existingCompany) {
      await session.abortTransaction();
      return next("Email address is already registered. Please login instead.");
    }

    let user;

    if (accountType === "company") {
      // Create company account
      console.log("Creating company account...");

      const companyData = {
        name: companyName.trim(),
        email: normalizedEmail,
        password,
        industry: industry || "",
        companySize: companySize || "1-10",
        website: website ? website.trim() : "",
      };

      console.log("Company data:", companyData);

      const company = await Companies.create([companyData], { session });
      user = company[0];

      console.log("Company created successfully:", company[0]._id);
    } else {
      // Create driver or admin account
      console.log("Creating user account...");

      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password,
        accountType,
      };

      console.log("User data:", userData);

      const createdUsers = await Users.create([userData], { session });
      user = createdUsers[0];

      console.log("User created successfully:", user._id);

      // If driver, also create driver profile
      if (accountType === "driver") {
        console.log("Creating driver profile...");
        const Drivers = (await import("../models/driverModel.js")).default;

        const driverData = {
          user: user._id,
          licenseNumber: "",
          licenseType: "",
          experience: 0,
          vehicleTypes: [],
          availability: {
            status: "offline",
            schedule: [],
          },
          rating: 0,
          reviews: [],
          currentLocation: {
            type: "Point",
            coordinates: [0, 0],
          },
          pricePerHour: 0,
          pricePerDay: 0,
          verified: false,
        };

        await Drivers.create([driverData], { session });
        console.log("Driver profile created successfully");
      }
    }

    // Commit the transaction
    await session.commitTransaction();

    // Generate token
    const token = await user.createJWT();

    // Prepare response user object
    const responseUser = {
      _id: user._id,
      email: user.email,
      accountType: accountType === "company" ? "company" : user.accountType,
    };

    // Add appropriate name fields based on account type
    if (accountType === "company") {
      responseUser.name = user.name;
    } else {
      responseUser.firstName = user.firstName;
      responseUser.lastName = user.lastName;
    }

    console.log("Registration successful for:", accountType, email);

    res.status(201).json({
      success: true,
      message: `${
        accountType.charAt(0).toUpperCase() + accountType.slice(1)
      } account created successfully`,
      user: responseUser,
      token,
    });
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();

    console.error("Registration error:", error);

    // Handle specific mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(`Validation error: ${validationErrors.join(", ")}`);
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return next("Email address is already registered. Please login instead.");
    }

    return next(`Registration failed: ${error.message}`);
  } finally {
    // End session
    session.endSession();
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  console.log("Login attempt for email:", email);

  try {
    // Validation
    if (!email || !password) {
      return next("Please provide email and password");
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check both Users and Companies collections
    const [user, company] = await Promise.all([
      Users.findOne({ email: normalizedEmail }).select("+password"),
      Companies.findOne({ email: normalizedEmail }).select("+password"),
    ]);

    let authenticatedUser = null;
    let isMatch = false;
    let accountType = null;

    if (user) {
      isMatch = await user.comparePassword(password);
      if (isMatch) {
        authenticatedUser = user;
        accountType = user.accountType;
      }
    } else if (company) {
      isMatch = await company.comparePassword(password);
      if (isMatch) {
        authenticatedUser = company;
        accountType = "company";
      }
    }

    if (!authenticatedUser || !isMatch) {
      return next("Invalid email or password");
    }

    authenticatedUser.password = undefined;

    const token = authenticatedUser.createJWT();

    // Prepare response user object
    const responseUser = {
      _id: authenticatedUser._id,
      email: authenticatedUser.email,
      accountType: accountType,
    };

    // Add appropriate name fields based on account type
    if (accountType === "company") {
      responseUser.name = authenticatedUser.name;
      responseUser.industry = authenticatedUser.industry;
      responseUser.companySize = authenticatedUser.companySize;
    } else {
      responseUser.firstName = authenticatedUser.firstName;
      responseUser.lastName = authenticatedUser.lastName;
    }

    console.log("Login successful for:", accountType, normalizedEmail);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: responseUser,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(`Login failed: ${error.message}`);
  }
};

export const testCompanyAuth = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Testing company auth for email:", email);

    // Check both collections
    const [user, company] = await Promise.all([
      Users.findOne({ email }),
      Companies.findOne({ email }),
    ]);

    res.json({
      success: true,
      data: {
        userExists: !!user,
        companyExists: !!company,
        userData: user
          ? {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              accountType: user.accountType,
            }
          : null,
        companyData: company
          ? {
              _id: company._id,
              name: company.name,
              email: company.email,
              accountType: "company",
              industry: company.industry,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user profile (auth endpoint)
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        success: false,
        message: `Invalid user ID: ${userId}`,
      });
    }

    const user = await Users.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile (auth endpoint)
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        success: false,
        message: `Invalid user ID: ${userId}`,
      });
    }

    // Remove sensitive fields that shouldn't be updated here
    delete updateData.password;
    delete updateData.accountType;
    delete updateData._id;

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
