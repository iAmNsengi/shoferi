import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleAvailability,
  updateDriverLocation,
  getDriverStats,
  getAllDrivers,
  getDriverById,
  searchDrivers,
  getDriverReviews,
  getProfileViews,
} from "../controllers/driverController.js";

const router = express.Router();

// Driver profile management
router.post("/register", isAuthenticated, registerDriver);
router.get("/profile", isAuthenticated, getDriverProfile);
router.put("/profile", isAuthenticated, updateDriverProfile);
router.post("/availability/toggle", isAuthenticated, toggleAvailability);
router.put("/toggle-availability", isAuthenticated, toggleAvailability);

// Location updates
router.put("/location", isAuthenticated, updateDriverLocation);
router.get("/stats", isAuthenticated, getDriverStats);

// Public driver listings
router.get("/", getAllDrivers);
router.get("/search", searchDrivers);
router.get("/:driverId", getDriverById);
router.get("/:driverId/reviews", getDriverReviews);
router.get("/:driverId/profile-views", isAuthenticated, getProfileViews);

export default router;
