import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
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
router.put("/toggle-availability", userAuth, toggleAvailability);

// Driver search routes
router.post("/search", searchDrivers);
router.get("/available", getAvailableDrivers);

export default router;
