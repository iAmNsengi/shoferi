import Drivers from "../models/driverModel.js";
import Users from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";

export const registerDriver = async (req, res) => {
  try {
    const {
      licenseNumber,
      licenseType,
      experience,
      pricePerHour,
      pricePerDay,
    } = req.body;

    // Check if driver already exists
    const existingDriver = await Drivers.findOne({ user: req.user.userId });
    if (existingDriver) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Driver profile already exists",
      });
    }

    // Create driver profile
    const driver = await Drivers.create({
      user: req.user.userId,
      licenseNumber,
      licenseType,
      experience,
      pricePerHour,
      pricePerDay,
    });

    // Update user account type
    await Users.findByIdAndUpdate(req.user.userId, { accountType: "driver" });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Driver profile created successfully",
      driver,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating driver profile",
      error: error.message,
    });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Drivers.findOne({ user: req.user.userId }).populate(
      "user",
      "firstName lastName email profileUrl"
    );

    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      driver,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching driver profile",
      error: error.message,
    });
  }
};

export const updateDriverProfile = async (req, res) => {
  try {
    const updates = req.body;
    const driver = await Drivers.findOneAndUpdate(
      { user: req.user.userId },
      updates,
      { new: true }
    );

    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Driver profile updated successfully",
      driver,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating driver profile",
      error: error.message,
    });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const driver = await Drivers.findOne({ user: req.user.userId });

    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    const newStatus =
      driver.availability.status === "available" ? "offline" : "available";
    driver.availability.status = newStatus;
    await driver.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Availability status updated successfully",
      status: newStatus,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating availability status",
      error: error.message,
    });
  }
};

export const searchDrivers = async (req, res) => {
  try {
    const {
      q: searchQuery,
      location,
      page = 1,
      experience,
      rating,
      availability = "all",
    } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Add search query
    if (searchQuery) {
      query.$or = [
        { "user.firstName": { $regex: searchQuery, $options: "i" } },
        { "user.lastName": { $regex: searchQuery, $options: "i" } },
        { licenseNumber: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Add location filter
    if (location) {
      // Add location-based search logic here
      // This would involve using MongoDB's geospatial queries
    }

    // Add experience filter
    if (experience) {
      query.experience = { $gte: parseInt(experience) };
    }

    // Add rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Add availability filter
    if (availability !== "all") {
      query["availability.status"] = availability;
    }

    const drivers = await Drivers.find(query)
      .populate("user", "firstName lastName email profileUrl")
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Drivers.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      count: drivers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      drivers,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error searching drivers",
      error: error.message,
    });
  }
};

export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Drivers.find({ "availability.status": "available" })
      .populate("user", "firstName lastName email profileUrl")
      .sort({ rating: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching available drivers",
      error: error.message,
    });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const driver = await Drivers.findOneAndUpdate(
      { user: req.user.userId },
      {
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Location updated successfully",
      location: driver.currentLocation,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating location",
      error: error.message,
    });
  }
};

export const getNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, vehicleType } = req.query;

    if (!latitude || !longitude) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const query = {
      "availability.status": "available",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    };

    // Add vehicle type filter if specified
    if (vehicleType) {
      query.vehicleTypes = { $in: [vehicleType] };
    }

    const nearbyDrivers = await Drivers.find(query)
      .populate("user", "firstName lastName email profileUrl phoneNumber")
      .limit(20);

    res.status(StatusCodes.OK).json({
      success: true,
      count: nearbyDrivers.length,
      drivers: nearbyDrivers,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching nearby drivers",
      error: error.message,
    });
  }
};

export const getDriverStats = async (req, res) => {
  try {
    const driver = await Drivers.findOne({ user: req.user.userId });
    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    // Get booking statistics from the Bookings collection
    const Bookings = (await import("../models/bookingModel.js")).default;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate booking stats
    const stats = await Bookings.aggregate([
      {
        $match: {
          driver: driver._id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalPrice" },
          totalTrips: { $sum: 1 },
          todayEarnings: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfDay] }, "$totalPrice", 0],
            },
          },
          weeklyEarnings: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfWeek] }, "$totalPrice", 0],
            },
          },
          monthlyEarnings: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$totalPrice", 0],
            },
          },
        },
      },
    ]);

    const driverStats = stats[0] || {
      totalEarnings: 0,
      totalTrips: 0,
      todayEarnings: 0,
      weeklyEarnings: 0,
      monthlyEarnings: 0,
    };

    // Calculate average rating
    const avgRating =
      driver.reviews.length > 0
        ? driver.reviews.reduce((sum, review) => sum + review.rating, 0) /
          driver.reviews.length
        : 0;

    res.status(StatusCodes.OK).json({
      success: true,
      stats: {
        ...driverStats,
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: driver.reviews.length,
        verificationStatus: driver.verified,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching driver stats",
      error: error.message,
    });
  }
};

export const smartDriverMatching = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      bookingType,
      preferredVehicleType,
      maxPrice,
    } = req.body;

    if (!pickupLocation || !pickupLocation.coordinates) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Pickup location with coordinates is required",
      });
    }

    // Build smart matching query
    const matchQuery = {
      "availability.status": "available",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: pickupLocation.coordinates,
          },
          $maxDistance: 15000, // 15km radius
        },
      },
    };

    // Add filters based on preferences
    if (preferredVehicleType) {
      matchQuery.vehicleTypes = { $in: [preferredVehicleType] };
    }

    if (maxPrice) {
      const priceField =
        bookingType === "hourly" ? "pricePerHour" : "pricePerDay";
      matchQuery[priceField] = { $lte: maxPrice };
    }

    // Find matching drivers
    const matchingDrivers = await Drivers.find(matchQuery)
      .populate("user", "firstName lastName email profileUrl phoneNumber")
      .lean();

    // Apply smart ranking algorithm
    const rankedDrivers = matchingDrivers.map((driver) => {
      let score = 0;

      // Rating score (40% weight)
      score += (driver.rating / 5) * 40;

      // Experience score (20% weight)
      score += Math.min(driver.experience / 10, 1) * 20;

      // Price competitiveness (20% weight)
      const priceField =
        bookingType === "hourly" ? "pricePerHour" : "pricePerDay";
      const avgPrice = bookingType === "hourly" ? 2000 : 15000; // Assumed averages
      score += (1 - driver[priceField] / avgPrice) * 20;

      // Distance score (20% weight)
      // This would require actual distance calculation, simplified here
      score += 20; // Placeholder

      return {
        ...driver,
        matchScore: Math.round(score),
      };
    });

    // Sort by match score (highest first)
    rankedDrivers.sort((a, b) => b.matchScore - a.matchScore);

    res.status(StatusCodes.OK).json({
      success: true,
      count: rankedDrivers.length,
      drivers: rankedDrivers.slice(0, 10), // Return top 10 matches
      algorithm: "smart_matching_v1",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error in smart driver matching",
      error: error.message,
    });
  }
};
