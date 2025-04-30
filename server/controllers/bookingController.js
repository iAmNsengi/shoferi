import Bookings from "../models/bookingModel.js";
import Drivers from "../models/driverModel.js";
import { StatusCodes } from "http-status-codes";

export const createBooking = async (req, res) => {
  try {
    const {
      driver: driverId,
      startDate,
      endDate,
      bookingType,
      pickupLocation,
      dropoffLocation,
      notes,
    } = req.body;

    // Check if driver exists and is available
    const driver = await Drivers.findById(driverId);
    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.availability.status !== "available") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Driver is not available",
      });
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const days = Math.ceil(hours / 24);

    const totalPrice =
      bookingType === "hourly"
        ? hours * driver.pricePerHour
        : days * driver.pricePerDay;

    // Create booking
    const booking = await Bookings.create({
      user: req.user.userId,
      driver: driverId,
      startDate,
      endDate,
      bookingType,
      totalPrice,
      pickupLocation,
      dropoffLocation,
      notes,
    });

    // Update driver availability
    driver.availability.status = "busy";
    await driver.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find({ user: req.user.userId })
      .populate("driver")
      .populate("user", "firstName lastName email profileUrl")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching user bookings",
      error: error.message,
    });
  }
};

export const getDriverBookings = async (req, res) => {
  try {
    const driver = await Drivers.findOne({ user: req.user.userId });
    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    const bookings = await Bookings.find({ driver: driver._id })
      .populate("user", "firstName lastName email profileUrl")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching driver bookings",
      error: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is authorized to update the booking
    const driver = await Drivers.findOne({ user: req.user.userId });
    if (!driver || booking.driver.toString() !== driver._id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    booking.status = status;
    await booking.save();

    // Update driver availability if booking is completed or cancelled
    if (status === "completed" || status === "cancelled") {
      driver.availability.status = "available";
      await driver.save();
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating booking status",
      error: error.message,
    });
  }
};

export const addBookingReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review } = req.body;

    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is authorized to review
    if (booking.user.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Not authorized to review this booking",
      });
    }

    // Add review to booking
    booking.rating = {
      score: rating,
      review,
    };
    await booking.save();

    // Update driver rating
    const driver = await Drivers.findById(booking.driver);
    const driverBookings = await Bookings.find({
      driver: booking.driver,
      "rating.score": { $exists: true },
    });

    const totalRating = driverBookings.reduce(
      (sum, booking) => sum + booking.rating.score,
      0
    );
    driver.rating = totalRating / driverBookings.length;

    // Add review to driver's reviews array
    driver.reviews.push({
      user: req.user.userId,
      rating,
      comment: review,
    });

    await driver.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Review added successfully",
      booking,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};
