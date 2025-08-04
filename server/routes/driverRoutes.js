import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleAvailability,
  searchDrivers,
  getAvailableDrivers,
  updateDriverLocation,
  getDriverStats,
  getNearbyDrivers,
  smartDriverMatching,
  trackProfileView,
  getProfileViews,
} from "../controllers/driverController.js";

const router = express.Router();

// Driver registration and profile routes
router.post("/register", userAuth, registerDriver);
router.get("/profile", userAuth, getDriverProfile);
router.put("/profile", userAuth, updateDriverProfile);
router.post("/availability/toggle", userAuth, toggleAvailability);
router.put("/toggle-availability", userAuth, toggleAvailability);

// Location and real-time features
router.put("/location", userAuth, updateDriverLocation);
router.get("/stats", userAuth, getDriverStats);
router.get("/nearby", getNearbyDrivers);

// Driver search routes
router.get("/search", searchDrivers);
router.get("/available", getAvailableDrivers);
router.post("/smart-match", smartDriverMatching);

// Profile view tracking routes
router.post("/:driverId/track-view", trackProfileView);
router.get("/:driverId/profile-views", userAuth, getProfileViews);

export default router;
