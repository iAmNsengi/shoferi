import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";

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

  try {
    // Check if email already exists in both Users and Companies collections
    const [userExist, companyExist] = await Promise.all([
      Users.findOne({ email }),
      Companies.findOne({ email })
    ]);

    if (userExist || companyExist) {
      return next("Email address is already registered. Please login instead.");
    }

    let user;

    // Create user based on account type
    if (accountType === "company") {
      // Create company account
      console.log("Creating company account...");
      
      const companyData = {
        name: companyName.trim(),
        email: email.toLowerCase().trim(),
        password,
        industry: industry?.trim() || "",
        companySize: companySize || "1-10",
        website: website?.trim() || "",
        contact: "",
        location: "",
        profileUrl: "",
        about: "",
      };

      console.log("Company data:", companyData);
      
      const company = await Companies.create(companyData);
      user = company;
      
      console.log("Company created successfully:", company._id);
    } else {
      // Create driver or admin account
      console.log("Creating user account...");
      
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        accountType,
      };

      console.log("User data:", userData);
      
      user = await Users.create(userData);
      
      console.log("User created successfully:", user._id);

      // If driver, also create driver profile
      if (accountType === "driver") {
        console.log("Creating driver profile...");
        const Drivers = (await import("../models/driverModel.js")).default;
        
        await Drivers.create({
          user: user._id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          phoneNumber: "",
          licenseNumber: "",
          vehicleTypes: [],
          experience: 0,
          availability: {
            isAvailable: false,
            workingHours: {
              start: "06:00",
              end: "22:00",
            },
          },
          currentLocation: {
            type: "Point",
            coordinates: [0, 0],
          },
          rating: {
            average: 0,
            count: 0,
            reviews: [],
          },
          status: "inactive",
        });
        console.log("Driver profile created successfully");
      }
    }

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
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide All User Credentials");
      return;
    }

    // Check both Users and Companies collections
    const [user, company] = await Promise.all([
      Users.findOne({ email }).select("+password"),
      (await import("../models/companiesModel.js")).default.findOne({ email }).select("+password")
    ]);

    let authenticatedUser = null;
    let isMatch = false;

    if (user) {
      isMatch = await user.comparePassword(password);
      if (isMatch) {
        authenticatedUser = user;
      }
    } else if (company) {
      isMatch = await company.comparePassword(password);
      if (isMatch) {
        authenticatedUser = company;
      }
    }

    if (!authenticatedUser || !isMatch) {
      next("Invalid email or password");
      return;
    }

    authenticatedUser.password = undefined;

    const token = authenticatedUser.createJWT();

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user: authenticatedUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
