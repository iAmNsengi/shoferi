import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllCompanies,
  getAllJobs,
  getAllBookings,
  updateUserStatus,
  updateCompanyStatus,
  getAnalytics,
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/adminController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin privileges
router.use(isAuthenticated);
router.use(isAdmin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:userId/status", updateUserStatus);

// Company management
router.get("/companies", getAllCompanies);
router.patch("/companies/:companyId/status", updateCompanyStatus);

// Job management
router.get("/jobs", getAllJobs);

// Booking management
router.get("/bookings", getAllBookings);

// Analytics
router.get("/analytics", getAnalytics);

// System settings
router.get("/settings", getSystemSettings);
router.patch("/settings", updateSystemSettings);

export default router;
