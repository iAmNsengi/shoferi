import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";

export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      category,
      location,
      salary,
      salaryType,
      vacancies,
      experience,
      details,
      vehicleRequirements,
      requirements,
      schedule,
      priority,
      benefits,
    } = req.body;

    if (
      !jobTitle ||
      !jobType ||
      !category ||
      !location ||
      !salary ||
      !details ||
      !details[0]?.desc ||
      !details[0]?.requirements
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const jobPost = {
      jobTitle,
      jobType,
      category,
      location,
      salary: Number(salary),
      salaryType: salaryType || "monthly",
      vacancies: Number(vacancies) || 1,
      experience: Number(experience) || 0,
      details,
      vehicleRequirements: vehicleRequirements || {},
      requirements: requirements || {},
      schedule: schedule || "flexible",
      priority: priority || "normal",
      benefits: benefits || [],
      company: req?.user?.userId,
      status: "active",
    };

    // Get company with given ID
    const company = await Companies.findById(req?.user?.userId);
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "You are not logged in as a company!",
      });
    }

    const job = new Jobs(jobPost);
    await job.save();

    // Add job to company's jobPosts array
    company.jobPosts.push(job._id);
    await Companies.findByIdAndUpdate(req?.user?.userId, company, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;
    const { jobId } = req.params;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !desc ||
      !requirements
    ) {
      next("Please Provide All Required Fields");
      return;
    }
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      _id: jobId,
    };

    await Jobs.findByIdAndUpdate(jobId, jobPost, { new: true });

    res.status(200).json({
      success: true,
      message: "Job Post Updated SUccessfully",
      jobPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getJobPosts = async (req, res, next) => {
  try {
    const { search, sort, location, jtype, exp } = req.query;
    const types = jtype?.split(","); //full-time,part-time
    const experience = exp?.split("-"); //2-6

    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
      queryObject.jobType = { $in: types };
    }

    //    [2. 6]

    if (exp) {
      queryObject.experience = {
        $gte: Number(experience[0]) - 1,
        $lte: Number(experience[1]) + 1,
      };
    }

    if (search) {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: search, $options: "i" } },
          { jobType: { $regex: search, $options: "i" } },
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Jobs.find(queryObject).populate({
      path: "company",
      select: "-password",
    });

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("jobTitle");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-jobTitle");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    //records count
    const totalJobs = await Jobs.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    queryResult = queryResult.limit(limit * page);

    const jobs = await queryResult;

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    const job = await Jobs.findById(jobId).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      return res.status(404).json({
        message: "Job Post Not Found",
        success: false,
      });
    }

    //GET SIMILAR JOB POST
    const searchQuery = {
      $and: [
        { _id: { $ne: jobId } }, // Exclude current job
        {
          $or: [
            { jobTitle: { $regex: job?.jobTitle, $options: "i" } },
            { jobType: { $regex: job?.jobType, $options: "i" } },
            { category: job?.category },
          ],
        },
      ],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteJobPost = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    await Jobs.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: "Job Post Deleted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params; // Job ID from the URL params
    const userId = req.user.userId; // User ID from the request body

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    // Check if the user exists
    const userExist = await Users.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        message: "You need to be logged in to apply!",
        success: false,
      });
    }

    // Check if the job post exists
    const job = await Jobs.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Job post with the given ID not found",
        success: false,
      });
    }

    // Check if the user has already applied for the job
    const hasApplied = job.applications.some(
      (application) => application.user.toString() === userId
    );
    if (hasApplied) {
      return res.status(400).json({
        message: "You have already applied for this job!",
        success: false,
      });
    }

    // Add the user to the applications array with proper structure
    job.applications.push({
      user: userId,
      appliedAt: new Date(),
      status: "pending",
    });

    // Save the updated job document
    await job.save();

    return res.status(200).json({
      message: "You have successfully applied for the job!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while applying for the job",
      success: false,
    });
  }
};

export const getNearbyJobs = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 25,
      category,
      experience,
      jobType,
      salaryMin,
      vehicleType,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;

    // Build query for location-based job search
    const query = {
      status: "active",
      expiresAt: { $gt: new Date() },
    };

    // Location-based filtering
    if (latitude && longitude) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    // Additional filters
    if (category) {
      query.category = category;
    }

    if (experience) {
      query.experience = { $lte: parseInt(experience) };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (salaryMin) {
      query.salary = { $gte: parseInt(salaryMin) };
    }

    if (vehicleType) {
      query["vehicleRequirements.vehicleType"] = { $in: [vehicleType] };
    }

    const jobs = await Jobs.find(query)
      .populate("company", "name profileUrl location")
      .sort({
        featured: -1,
        priority: -1,
        urgent: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Jobs.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching nearby jobs",
      error: error.message,
    });
  }
};

export const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const jobs = await Jobs.find({
      category,
      status: "active",
      expiresAt: { $gt: new Date() },
    })
      .populate("company", "name profileUrl location")
      .sort({ featured: -1, priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Jobs.countDocuments({
      category,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching jobs by category",
      error: error.message,
    });
  }
};

export const smartJobMatching = async (req, res) => {
  try {
    // Get driver profile to understand preferences and capabilities
    const Drivers = (await import("../models/driverModel.js")).default;
    const driver = await Drivers.findOne({ user: req.user.userId });

    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    const { latitude, longitude } = driver.currentLocation?.coordinates || [];

    // Build smart matching query
    const matchQuery = {
      status: "active",
      expiresAt: { $gt: new Date() },
      experience: { $lte: driver.experience || 0 },
    };

    // Location-based matching if driver has location
    if (latitude && longitude) {
      matchQuery.coordinates = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 50000, // 50km radius
        },
      };
    }

    // Vehicle type matching
    if (driver.vehicleTypes && driver.vehicleTypes.length > 0) {
      matchQuery.$or = [
        { "vehicleRequirements.vehicleType": { $in: driver.vehicleTypes } },
        { "vehicleRequirements.vehicleType": { $exists: false } },
        { "vehicleRequirements.vehicleType": { $size: 0 } },
      ];
    }

    const matchingJobs = await Jobs.find(matchQuery)
      .populate("company", "name profileUrl location")
      .lean();

    // Apply smart ranking algorithm
    const rankedJobs = matchingJobs.map((job) => {
      let score = 0;

      // Salary score (30% weight)
      const salaryScore = Math.min(job.salary / 100000, 1) * 30; // Normalize to 100k max
      score += salaryScore;

      // Experience match score (25% weight)
      const expDiff = Math.abs(
        (job.experience || 0) - (driver.experience || 0)
      );
      const expScore = Math.max(0, (10 - expDiff) / 10) * 25;
      score += expScore;

      // Priority/urgency bonus (20% weight)
      if (job.urgent) score += 15;
      if (job.priority === "high") score += 10;
      if (job.priority === "urgent") score += 20;
      if (job.featured) score += 5;

      // Location proximity score (15% weight)
      // This would require actual distance calculation
      score += 15; // Placeholder

      // Vehicle type match bonus (10% weight)
      if (job.vehicleRequirements?.vehicleType) {
        const hasMatchingVehicle = driver.vehicleTypes?.some((type) =>
          job.vehicleRequirements.vehicleType.includes(type)
        );
        if (hasMatchingVehicle) score += 10;
      } else {
        score += 5; // No specific requirement
      }

      return {
        ...job,
        matchScore: Math.round(score),
        matchReasons: [
          ...(job.urgent ? ["Urgent job"] : []),
          ...(job.featured ? ["Featured opportunity"] : []),
          `${job.salary.toLocaleString()} RWF salary`,
          `${job.experience || 0} years experience required`,
        ],
      };
    });

    // Sort by match score (highest first)
    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(StatusCodes.OK).json({
      success: true,
      count: rankedJobs.length,
      jobs: rankedJobs.slice(0, 20), // Return top 20 matches
      algorithm: "smart_job_matching_v1",
      driverProfile: {
        experience: driver.experience,
        vehicleTypes: driver.vehicleTypes,
        location: driver.currentLocation,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error in smart job matching",
      error: error.message,
    });
  }
};

export const getJobCategories = async (req, res) => {
  try {
    // Get all available categories with job counts
    const categories = await Jobs.aggregate([
      {
        $match: {
          status: "active",
          expiresAt: { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgSalary: { $avg: "$salary" },
          urgentJobs: {
            $sum: { $cond: ["$urgent", 1, 0] },
          },
          featuredJobs: {
            $sum: { $cond: ["$featured", 1, 0] },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Add category descriptions
    const categoryInfo = {
      ride_sharing: {
        title: "Ride Sharing",
        description: "Drive passengers using ride-sharing platforms",
        icon: "car",
      },
      delivery: {
        title: "Delivery Services",
        description: "Deliver food, packages, and goods",
        icon: "package",
      },
      logistics: {
        title: "Logistics",
        description: "Transport goods and cargo",
        icon: "truck",
      },
      transport: {
        title: "Transportation",
        description: "General transportation services",
        icon: "bus",
      },
      chauffeur: {
        title: "Chauffeur Services",
        description: "Professional driving for VIP clients",
        icon: "user-tie",
      },
      moving_services: {
        title: "Moving Services",
        description: "Help people relocate their belongings",
        icon: "home",
      },
      tour_guide: {
        title: "Tour Guide",
        description: "Drive tourists and provide guided tours",
        icon: "map",
      },
      emergency_transport: {
        title: "Emergency Transport",
        description: "Medical and emergency transportation",
        icon: "ambulance",
      },
      goods_transport: {
        title: "Goods Transport",
        description: "Commercial goods transportation",
        icon: "boxes",
      },
      passenger_transport: {
        title: "Passenger Transport",
        description: "Public and private passenger services",
        icon: "users",
      },
    };

    const enrichedCategories = categories.map((cat) => ({
      ...cat,
      ...categoryInfo[cat._id],
      avgSalary: Math.round(cat.avgSalary),
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      categories: enrichedCategories,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching job categories",
      error: error.message,
    });
  }
};

export const trackJobView = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Jobs.findByIdAndUpdate(
      jobId,
      { $inc: { "analytics.views": 1 } },
      { new: true }
    );

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Job view tracked",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error tracking job view",
      error: error.message,
    });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query to find jobs where user has applied
    const query = {
      "applications.user": req.user.userId,
    };

    if (status) {
      query["applications.status"] = status;
    }

    const jobs = await Jobs.find(query)
      .populate("company", "name profileUrl location")
      .sort({ "applications.appliedAt": -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Extract user's applications with job details
    const userApplications = jobs.map((job) => {
      const userApplication = job.applications.find(
        (app) => app.user.toString() === req.user.userId
      );

      return {
        _id: userApplication._id,
        job: {
          _id: job._id,
          jobTitle: job.jobTitle,
          company: job.company,
          salary: job.salary,
          location: job.location,
          jobType: job.jobType,
          category: job.category,
        },
        appliedAt: userApplication.appliedAt,
        status: userApplication.status,
        response: userApplication.response,
        notes: userApplication.notes,
        interview: userApplication.interview,
      };
    });

    const total = await Jobs.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      count: userApplications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      applications: userApplications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching user applications",
      error: error.message,
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Check if job exists and belongs to the requesting company
    const job = await Jobs.findById(jobId).populate("company");

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if the requesting user is the company that posted the job
    if (job.company._id.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized to view applications for this job",
      });
    }

    let applications = job.applications;

    // Filter by status if provided
    if (status) {
      applications = applications.filter((app) => app.status === status);
    }

    // Apply pagination
    const paginatedApplications = applications.slice(
      skip,
      skip + parseInt(limit)
    );

    // Populate user details for applications
    const populatedApplications = await Jobs.populate(paginatedApplications, {
      path: "user",
      select: "firstName lastName email profileUrl phoneNumber",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      count: paginatedApplications.length,
      total: applications.length,
      totalPages: Math.ceil(applications.length / limit),
      currentPage: parseInt(page),
      applications: populatedApplications,
      job: {
        _id: job._id,
        jobTitle: job.jobTitle,
        company: job.company.name,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching job applications",
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, response, notes, interview } = req.body;

    // Valid statuses
    const validStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "accepted",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // Find the job containing this application
    const job = await Jobs.findOne({
      "applications._id": applicationId,
    }).populate("company");

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if the requesting user is the company that posted the job
    if (job.company._id.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized to update this application",
      });
    }

    // Find and update the specific application
    const applicationIndex = job.applications.findIndex(
      (app) => app._id.toString() === applicationId
    );

    if (applicationIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found in this job",
      });
    }

    // Update application details
    job.applications[applicationIndex].status = status;

    if (response) {
      job.applications[applicationIndex].response = response;
    }

    if (notes) {
      job.applications[applicationIndex].notes = notes;
    }

    if (interview) {
      job.applications[applicationIndex].interview = {
        ...job.applications[applicationIndex].interview,
        ...interview,
      };
    }

    await job.save();

    // Populate user details for the updated application
    await job.populate("applications.user", "firstName lastName email");

    const updatedApplication = job.applications[applicationIndex];

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating application status",
      error: error.message,
    });
  }
};

// Create alias for getJobPosts to maintain compatibility
export const getJobs = getJobPosts;
