import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  getUser,
  updateUser,
  getUserProfile,
  updateUserPreferences,
  updateNotificationSettings,
  updatePrivacySettings,
  changePassword,
  deactivateAccount,
  deleteAccount,
  getUserStats,
} from "../controllers/userController.js";

const router = express.Router();

// GET current user profile (authenticated)
router.get("/get-user", isAuthenticated, getUserProfile);

// GET USER STATS
router.get("/stats", isAuthenticated, getUserStats);

// GET user by ID
router.get("/:id", getUser);

// UPDATE USER || PUT
router.put("/update-user", isAuthenticated, updateUser);

// UPDATE USER PREFERENCES
router.put("/preferences", isAuthenticated, updateUserPreferences);

// UPDATE NOTIFICATION SETTINGS
router.put("/notifications", isAuthenticated, updateNotificationSettings);

// UPDATE PRIVACY SETTINGS
router.put("/privacy", isAuthenticated, updatePrivacySettings);

// CHANGE PASSWORD
router.put("/change-password", isAuthenticated, changePassword);

// DEACTIVATE ACCOUNT
router.put("/deactivate", isAuthenticated, deactivateAccount);

// DELETE ACCOUNT
router.delete("/delete-account", isAuthenticated, deleteAccount);

export default router;
