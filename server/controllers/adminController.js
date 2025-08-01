import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";
import Bookings from "../models/bookingModel.js";
import Payments from "../models/paymentModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get counts
    const totalUsers = await Users.countDocuments();
    const totalCompanies = await Companies.countDocuments();
    const totalJobs = await Jobs.countDocuments();
    const totalBookings = await Bookings.countDocuments();

    // Get recent activity
    const newUsersThisWeek = await Users.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const newCompaniesThisWeek = await Companies.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const newJobsThisWeek = await Jobs.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Get revenue data
    const totalRevenue = await Payments.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const revenueThisWeek = await Payments.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: weekAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get active users (users who logged in within last 7 days)
    const activeUsers = await Users.countDocuments({
      lastActive: { $gte: weekAgo },
    });

    // Get average rating
    const avgRating = await Users.aggregate([
      { $match: { rating: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);

    const stats = {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalBookings,
      activeUsers,
      newUsersThisWeek,
      newCompaniesThisWeek,
      newJobsThisWeek,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueThisWeek: revenueThisWeek[0]?.total || 0,
      avgRating: avgRating[0]?.avg || 0,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users with pagination and filters
export const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      accountType = "",
      status = "",
    } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Add account type filter
    if (accountType) {
      query.accountType = accountType;
    }

    // Add status filter
    if (status) {
      query.accountStatus = status;
    }

    const users = await Users.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Users.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all companies with pagination and filters
export const getAllCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status) {
      query.accountStatus = status;
    }

    const companies = await Companies.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Companies.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: {
        companies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all jobs with pagination and filters
export const getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    const jobs = await Jobs.find(query)
      .populate("company", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Jobs.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Jobs retrieved successfully",
      data: {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings with pagination and filters
export const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add status filter
    if (status) {
      query.status = status;
    }

    const bookings = await Bookings.find(query)
      .populate("passenger", "firstName lastName email")
      .populate("driver", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Bookings.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    const user = await Users.findByIdAndUpdate(
      userId,
      { accountStatus },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update company status
export const updateCompanyStatus = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { accountStatus } = req.body;

    const company = await Companies.findByIdAndUpdate(
      companyId,
      { accountStatus },
      { new: true }
    ).select("-password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company status updated successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics data
export const getAnalytics = async (req, res, next) => {
  try {
    const { period = "30d" } = req.query;

    let startDate;
    const now = new Date();

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // User registration trend
    const userRegistrations = await Users.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Company registration trend
    const companyRegistrations = await Companies.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Job posting trend
    const jobPostings = await Jobs.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Revenue trend
    const revenueTrend = await Payments.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // User demographics
    const userDemographics = await Users.aggregate([
      {
        $group: {
          _id: "$accountType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Job categories
    const jobCategories = await Jobs.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Analytics data retrieved successfully",
      data: {
        userRegistrations,
        companyRegistrations,
        jobPostings,
        revenueTrend,
        userDemographics,
        jobCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get system settings
export const getSystemSettings = async (req, res, next) => {
  try {
    // In a real application, you would store these in a separate settings collection
    const settings = {
      maintenanceMode: false,
      emailNotifications: true,
      smsNotifications: true,
      maxFileSize: 5242880, // 5MB
      allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
      sessionTimeout: 3600, // 1 hour
      maxLoginAttempts: 5,
      passwordMinLength: 6,
    };

    res.status(200).json({
      success: true,
      message: "System settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update system settings
export const updateSystemSettings = async (req, res, next) => {
  try {
    const { maintenanceMode, emailNotifications, smsNotifications } = req.body;

    // In a real application, you would update these in a database
    const settings = {
      maintenanceMode: maintenanceMode || false,
      emailNotifications:
        emailNotifications !== undefined ? emailNotifications : true,
      smsNotifications:
        smsNotifications !== undefined ? smsNotifications : true,
    };

    res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
