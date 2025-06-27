import mongoose from "mongoose";
import Users from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    jobTitle,
    about,
    phoneNumber,
    dateOfBirth,
    gender,
    address,
    emergencyContact,
    socialLinks,
    skills,
    experience,
    education,
    certifications,
  } = req.body;

  try {
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields: firstName, lastName, email",
      });
    }

    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        success: false,
        message: `Invalid user ID: ${userId}`,
      });
    }

    const updateUser = {
      firstName,
      lastName,
      email,
      contact,
      location,
      profileUrl,
      jobTitle,
      about,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      socialLinks,
      skills,
      experience,
      education,
      certifications,
      lastActive: new Date(),
    };

    // Remove undefined values
    Object.keys(updateUser).forEach(key => 
      updateUser[key] === undefined && delete updateUser[key]
    );

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
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

export const updateUserPreferences = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: "Preferences data is required",
      });
    }

    const user = await Users.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          preferences: { ...preferences },
          lastActive: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
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

export const updateNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { notifications } = req.body;

    if (!notifications) {
      return res.status(400).json({
        success: false,
        message: "Notification settings are required",
      });
    }

    const user = await Users.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          "preferences.notifications": notifications,
          lastActive: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
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

export const updatePrivacySettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { privacy } = req.body;

    if (!privacy) {
      return res.status(400).json({
        success: false,
        message: "Privacy settings are required",
      });
    }

    const user = await Users.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          "preferences.privacy": privacy,
          lastActive: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
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

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deactivateAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { reason } = req.body;

    const user = await Users.findByIdAndUpdate(
      userId,
      { 
        accountStatus: "deactivated",
        lastActive: new Date(),
        deactivationReason: reason || "User requested"
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // You can enhance this with actual stats from jobs, applications etc.
    const stats = {
      jobsApplied: 0,
      interviews: 0,
      profileViews: 0,
      profileCompleteness: 0,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await Users.findByIdAndUpdate(
      userId,
      { lastActive: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching user profile",
      success: false,
      error: error.message,
    });
  }
};
