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
