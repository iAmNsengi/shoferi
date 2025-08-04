import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";
import { response } from "express";

export const register = async (req, res, next) => {
  const { name, email, password, contact, location, about, profileUrl } =
    req.body;

  //validate fields
  if (!name) {
    next("Company Name is required!");
    return;
  }
  if (!email) {
    next("Email address is required!");
    return;
  }
  if (!password) {
    next("Password is required and must be greater than 6 characters");
    return;
  }

  try {
    const accountExist = await Companies.findOne({ email });

    if (accountExist) {
      next("Email Already Registered. Please Login");
      return;
    }

    // create a new account
    const company = await Companies.create({
      name,
      email,
      password,
      contact,
      location,
      about,
      profileUrl,
    });

    // user token
    const token = company.createJWT();

    res.status(201).json({
      success: true,
      message: "Company Account Created Successfully",
      user: {
        _id: company._id,
        name: company.name,
        email: company.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide AUser Credentials");
      return;
    }

    const company = await Companies.findOne({ email }).select("+password");

    if (!company) {
      next("Invalid email or Password");
      return;
    }

    //compare password
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      next("Invalid email or Password");
      return;
    }
    company.password = undefined;

    const token = company.createJWT();

    res.status(200).json({
      success: true,
      message: "Login SUccessfully",
      user: company,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  const {
    name,
    contact,
    location,
    profileUrl,
    about,
    industry,
    companySize,
    website,
    foundedYear,
    email,
  } = req.body;

  try {
    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const id = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const updateCompany = {
      name,
      contact: contact || "",
      location: location || "",
      profileUrl: profileUrl || "",
      about: about || "",
      industry: industry || "",
      companySize: companySize || "1-10",
      website: website || "",
      foundedYear: foundedYear || "",
      email: email || "",
      _id: id,
    };

    // Remove undefined values
    Object.keys(updateCompany).forEach(
      (key) => updateCompany[key] === undefined && delete updateCompany[key]
    );

    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company Profile Updated Successfully",
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    console.log("🏢 GET /get-company-profile - Request received");
    console.log("🔑 User ID from token:", req.user?.userId);

    const id = req.user.userId;

    // First, try to find the company directly by ID
    let company = await Companies.findById({ _id: id });
    console.log(
      "🔍 Direct company search result:",
      company ? "Found" : "Not found"
    );

    if (!company) {
      // If not found as a company, check if this is a user with company account type
      const { default: Users } = await import("../models/userModel.js");
      const user = await Users.findById({ _id: id });
      console.log(
        "👤 User search result:",
        user ? `Found user with accountType: ${user.accountType}` : "Not found"
      );

      if (user && user.accountType === "company") {
        // Look for a company with the same email as the user
        company = await Companies.findOne({ email: user.email });
        console.log(
          "📧 Company search by email result:",
          company ? "Found" : "Not found"
        );
      }

      if (!company) {
        console.log("❌ No company profile found for user:", id);
        return res.status(404).json({
          message: "Company Profile Not Found",
          success: false,
        });
      }
    }

    company.password = undefined;
    console.log("✅ Company profile found and returned");
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log("💥 Error in getCompanyProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET ALL COMPANIES
export const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;

    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Companies.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");
    }

    // PADINATIONS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Companies.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);
    // move next page
    // queryResult = queryResult.skip(skip).limit(limit);

    // show mopre instead of moving to next page
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET  COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.user.userId;

  try {
    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.location = { $regex: search, $options: "i" };
    }

    let sorting;
    //sorting || another way
    if (sort === "Newest") {
      sorting = "-createdAt";
    }
    if (sort === "Oldest") {
      sorting = "createdAt";
    }
    if (sort === "A-Z") {
      sorting = "name";
    }
    if (sort === "Z-A") {
      sorting = "-name";
    }

    let queryResult = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sorting },
    });
    const companies = await queryResult;

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE COMPANY
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: "-_id",
      },
    });

    if (!company) {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// GET COMPANY STATS
export const getCompanyStats = async (req, res, next) => {
  try {
    const companyId = req.user.userId;

    // Import Jobs model dynamically to avoid circular dependency
    const { default: Jobs } = await import("../models/jobsModel.js");

    // First, try to find the company directly by ID
    let company = await Companies.findById(companyId).populate("jobPosts");

    if (!company) {
      // If not found as a company, check if this is a user with company account type
      const { default: Users } = await import("../models/userModel.js");
      const user = await Users.findById({ _id: companyId });

      if (user && user.accountType === "company") {
        // Look for a company with the same email as the user
        company = await Companies.findOne({ email: user.email }).populate(
          "jobPosts"
        );
      }

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }
    }

    // Calculate stats
    const totalJobs = company.jobPosts.length;
    const activeJobs = company.jobPosts.filter(
      (job) => job.status === "active"
    ).length;

    // Get total applications across all jobs - use company._id for the query
    const allJobs = await Jobs.find({ company: company._id });
    const totalApplications = allJobs.reduce(
      (total, job) => total + (job.application?.length || 0),
      0
    );

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = allJobs.reduce((total, job) => {
      const recentJobApplications =
        job.application?.filter(
          (app) => new Date(app.createdAt) > thirtyDaysAgo
        ) || [];
      return total + recentJobApplications.length;
    }, 0);

    const stats = {
      totalJobs,
      activeJobs,
      totalApplications,
      recentApplications,
      companyAge: company.foundedYear
        ? new Date().getFullYear() - company.foundedYear
        : 0,
      profileCompletion: calculateProfileCompletion(company),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET COMPANY DASHBOARD DATA
export const getCompanyDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.userId;

    // Get company with populated job posts
    const company = await Companies.findById(companyId).populate({
      path: "jobPosts",
      populate: {
        path: "applications.user",
        select: "firstName lastName email profileUrl",
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Calculate dashboard metrics
    const totalJobs = company.jobPosts.length;
    const activeJobs = company.jobPosts.filter(
      (job) => job.status === "active"
    ).length;
    const pausedJobs = company.jobPosts.filter(
      (job) => job.status === "paused"
    ).length;
    const closedJobs = company.jobPosts.filter(
      (job) => job.status === "closed"
    ).length;

    // Calculate application metrics
    let totalApplications = 0;
    let pendingApplications = 0;
    let recentApplications = 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    company.jobPosts.forEach((job) => {
      totalApplications += job.applications.length;
      pendingApplications += job.applications.filter(
        (app) => app.status === "pending"
      ).length;
      recentApplications += job.applications.filter(
        (app) => new Date(app.appliedAt) > thirtyDaysAgo
      ).length;
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentJobs = company.jobPosts.filter(
      (job) => new Date(job.createdAt) > sevenDaysAgo
    ).length;

    const recentApplicationsCount = company.jobPosts.reduce((total, job) => {
      return (
        total +
        job.applications.filter((app) => new Date(app.appliedAt) > sevenDaysAgo)
          .length
      );
    }, 0);

    // Get top performing jobs (by application count)
    const topJobs = company.jobPosts
      .sort((a, b) => b.applications.length - a.applications.length)
      .slice(0, 5)
      .map((job) => ({
        _id: job._id,
        jobTitle: job.jobTitle,
        applications: job.applications.length,
        status: job.status,
        createdAt: job.createdAt,
      }));

    const dashboard = {
      overview: {
        totalJobs,
        activeJobs,
        pausedJobs,
        closedJobs,
        totalApplications,
        pendingApplications,
        recentApplications,
      },
      recentActivity: {
        newJobs: recentJobs,
        newApplications: recentApplicationsCount,
      },
      topJobs,
      profileCompletion: calculateProfileCompletion(company),
    };

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET COMPANY JOB ANALYTICS
export const getCompanyJobAnalytics = async (req, res, next) => {
  try {
    const companyId = req.user.userId;
    const { jobId, period = "30" } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Build query
    const query = { company: companyId };
    if (jobId) {
      query._id = jobId;
    }

    const jobs = await Jobs.find(query);

    if (!jobs.length) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalViews: 0,
          totalApplications: 0,
          averageApplicationsPerJob: 0,
          applicationRate: 0,
          topCategories: [],
          applicationTrends: [],
        },
      });
    }

    // Calculate analytics
    const totalViews = jobs.reduce(
      (sum, job) => sum + (job.analytics?.views || 0),
      0
    );
    const totalApplications = jobs.reduce(
      (sum, job) => sum + job.applications.length,
      0
    );
    const averageApplicationsPerJob = totalApplications / jobs.length;

    // Calculate application rate (applications per view)
    const applicationRate =
      totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;

    // Get top categories by application count
    const categoryStats = {};
    jobs.forEach((job) => {
      if (!categoryStats[job.category]) {
        categoryStats[job.category] = 0;
      }
      categoryStats[job.category] += job.applications.length;
    });

    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Calculate application trends (last 30 days by default)
    const applicationTrends = [];
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const applicationsOnDate = jobs.reduce((sum, job) => {
        return (
          sum +
          job.applications.filter(
            (app) => app.appliedAt.toISOString().split("T")[0] === dateStr
          ).length
        );
      }, 0);

      applicationTrends.push({
        date: dateStr,
        applications: applicationsOnDate,
      });
    }

    const analytics = {
      totalViews,
      totalApplications,
      averageApplicationsPerJob:
        Math.round(averageApplicationsPerJob * 100) / 100,
      applicationRate: Math.round(applicationRate * 100) / 100,
      topCategories,
      applicationTrends,
    };

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// SCHEDULE INTERVIEW
export const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { scheduled, location, type, notes } = req.body;
    const companyId = req.user.userId;

    if (!scheduled || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time, location, and type are required",
      });
    }

    const validTypes = ["in_person", "phone", "video"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview type",
      });
    }

    // Find the job containing this application
    const job = await Jobs.findOne({
      "applications._id": applicationId,
      company: companyId,
    }).populate("applications.user", "firstName lastName email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Find and update the specific application
    const applicationIndex = job.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update application with interview details
    job.applications[applicationIndex].interview = {
      scheduled: new Date(scheduled),
      location,
      type,
    };

    if (notes) {
      job.applications[applicationIndex].notes = notes;
    }

    // Update status to reviewed
    job.applications[applicationIndex].status = "reviewed";

    await job.save();

    const updatedApplication = job.applications[applicationIndex];

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL APPLICATIONS FOR COMPANY
export const getCompanyApplications = async (req, res, next) => {
  try {
    const companyId = req.user.userId;
    const {
      page = 1,
      limit = 10,
      status,
      jobId,
      sortBy = "appliedAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;

    // Build query for company's jobs
    const query = { company: companyId };
    if (jobId) {
      query._id = jobId;
    }

    // Get all jobs for the company with applications
    const jobs = await Jobs.find(query).populate({
      path: "applications.user",
      select: "firstName lastName email profileUrl phoneNumber location",
    });

    if (!jobs.length) {
      return res.status(200).json({
        success: true,
        applications: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        },
      });
    }

    // Collect all applications
    let allApplications = [];
    jobs.forEach((job) => {
      job.applications.forEach((app) => {
        allApplications.push({
          ...app.toObject(),
          job: {
            _id: job._id,
            jobTitle: job.jobTitle,
            category: job.category,
            location: job.location,
          },
        });
      });
    });

    // Filter by status
    if (status) {
      allApplications = allApplications.filter((app) => app.status === status);
    }

    // Sort applications
    allApplications.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "desc") {
        return new Date(bValue) - new Date(aValue);
      } else {
        return new Date(aValue) - new Date(bValue);
      }
    });

    // Apply pagination
    const total = allApplications.length;
    const paginatedApplications = allApplications.slice(
      skip,
      skip + parseInt(limit)
    );

    res.status(200).json({
      success: true,
      applications: paginatedApplications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// BULK UPDATE APPLICATION STATUS
export const bulkUpdateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationIds, status, response, notes } = req.body;
    const companyId = req.user.userId;

    if (
      !applicationIds ||
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Application IDs are required",
      });
    }

    const validStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "accepted",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Find all jobs for this company that contain the specified applications
    const jobs = await Jobs.find({
      company: companyId,
      "applications._id": { $in: applicationIds },
    });

    if (!jobs.length) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this company",
      });
    }

    let updatedCount = 0;

    // Update each application
    for (const job of jobs) {
      for (const applicationId of applicationIds) {
        const applicationIndex = job.applications.findIndex(
          (app) => app._id.toString() === applicationId
        );

        if (applicationIndex !== -1) {
          job.applications[applicationIndex].status = status;
          if (response) {
            job.applications[applicationIndex].response = response;
          }
          if (notes) {
            job.applications[applicationIndex].notes = notes;
          }
          updatedCount++;
        }
      }
      await job.save();
    }

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} applications`,
      updatedCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (company) => {
  const fields = [
    "name",
    "email",
    "contact",
    "location",
    "about",
    "industry",
    "companySize",
    "website",
  ];
  const filledFields = fields.filter(
    (field) => company[field] && company[field].toString().trim() !== ""
  );
  return Math.round((filledFields.length / fields.length) * 100);
};
