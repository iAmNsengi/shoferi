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
    website
  } = req.body;

  console.log("Registration attempt:", { accountType, email, companyName, firstName, lastName });

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
      Companies.findOne({ email: normalizedEmail })
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
          // Only include fields that exist in the driver schema
          licenseNumber: "",
          licenseType: "",
          experience: 0,
          vehicleTypes: [],
          availability: {
            status: "offline",
            schedule: [],
          },
          rating: 0, // Fixed: should be a number, not an object
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
      message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created successfully`,
      user: responseUser,
      token,
    });
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    
    console.error("Registration error:", error);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(`Validation error: ${validationErrors.join(', ')}`);
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
      Companies.findOne({ email: normalizedEmail }).select("+password")
    ]);

    console.log("Found user:", !!user, "Found company:", !!company);

    let authenticatedUser = null;
    let isMatch = false;
    let accountType = null;

    if (user) {
      console.log("Checking user password...");
      isMatch = await user.comparePassword(password);
      if (isMatch) {
        authenticatedUser = user;
        accountType = user.accountType;
        console.log("User authentication successful, account type:", accountType);
    }
    } else if (company) {
      console.log("Checking company password...");
      isMatch = await company.comparePassword(password);
      if (isMatch) {
        authenticatedUser = company;
        accountType = "company";
        console.log("Company authentication successful");
      }
    }

    if (!authenticatedUser || !isMatch) {
      console.log("Authentication failed: Invalid credentials");
      return next("Invalid email or password");
    }

    // Remove password from response
    authenticatedUser.password = undefined;

    // Generate token
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
      Companies.findOne({ email })
    ]);
    
    res.json({
      success: true,
      data: {
        userExists: !!user,
        companyExists: !!company,
        userData: user ? {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType
        } : null,
        companyData: company ? {
          _id: company._id,
          name: company.name,
          email: company.email,
          accountType: "company",
          industry: company.industry
        } : null
      }
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
