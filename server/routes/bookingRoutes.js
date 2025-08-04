import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createBooking,
  getUserBookings,
  getDriverBookings,
  updateBookingStatus,
  addBookingReview,
} from "../controllers/bookingController.js";

const router = express.Router();

// Booking routes
router.post("/create", isAuthenticated, createBooking);
router.get("/user", isAuthenticated, getUserBookings);
router.get("/driver", isAuthenticated, getDriverBookings);
router.put("/:bookingId/status", isAuthenticated, updateBookingStatus);
router.post("/:bookingId/review", isAuthenticated, addBookingReview);

export default router;
