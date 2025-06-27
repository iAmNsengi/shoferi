import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUser,
  updateUser,
  getUserProfile,
  updateUserPreferences,
  updateNotificationSettings,
  updatePrivacySettings,
  changePassword,
  deactivateAccount,
  getUserStats,
} from "../controllers/userController.js";

const router = express.Router();

// GET current user profile (authenticated)
router.get("/get-user", userAuth, getUserProfile);

// GET user by ID
router.get("/:id", getUser);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

// UPDATE USER PREFERENCES
router.put("/preferences", userAuth, updateUserPreferences);

// UPDATE NOTIFICATION SETTINGS
router.put("/notifications", userAuth, updateNotificationSettings);

// UPDATE PRIVACY SETTINGS
router.put("/privacy", userAuth, updatePrivacySettings);

// CHANGE PASSWORD
router.put("/change-password", userAuth, changePassword);

// DEACTIVATE ACCOUNT
router.put("/deactivate", userAuth, deactivateAccount);

// GET USER STATS
router.get("/stats", userAuth, getUserStats);

export default router;
