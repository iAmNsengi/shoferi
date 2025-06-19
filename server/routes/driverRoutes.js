import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleAvailability,
  searchDrivers,
  getAvailableDrivers,
} from "../controllers/driverController.js";

const router = express.Router();

// Driver registration and profile routes
router.post("/register", userAuth, registerDriver);
router.get("/profile", userAuth, getDriverProfile);
router.put("/profile", userAuth, updateDriverProfile);
router.post("/availability/toggle", userAuth, toggleAvailability);
router.put("/toggle-availability", userAuth, toggleAvailability);

// Driver search routes
router.get("/search", searchDrivers);
router.get("/available", getAvailableDrivers);

export default router;
