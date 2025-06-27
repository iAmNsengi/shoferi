import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createBooking,
  getUserBookings,
  getDriverBookings,
  updateBookingStatus,
  addBookingReview,
} from "../controllers/bookingController.js";

const router = express.Router();

// Booking routes
router.post("/create", userAuth, createBooking);
router.get("/user", userAuth, getUserBookings);
router.get("/driver", userAuth, getDriverBookings);
router.put("/:bookingId/status", userAuth, updateBookingStatus);
router.post("/:bookingId/review", userAuth, addBookingReview);

export default router;
