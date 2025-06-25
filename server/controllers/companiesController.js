import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
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
    email
  } = req.body;

  try {
    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
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
    Object.keys(updateCompany).forEach(key => 
      updateCompany[key] === undefined && delete updateCompany[key]
    );

    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
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
      message: error.message 
    });
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.user.userId;

    // First, try to find the company directly by ID
    let company = await Companies.findById({ _id: id });

    if (!company) {
      // If not found as a company, check if this is a user with company account type
      const { default: Users } = await import("../models/userModel.js");
      const user = await Users.findById({ _id: id });
      
      if (user && user.accountType === "company") {
        // Look for a company with the same email as the user
        company = await Companies.findOne({ email: user.email });
      }
      
      if (!company) {
        return res.status(404).json({
          message: "Company Profile Not Found",
          success: false,
        });
      }
    }

    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false,
      message: error.message 
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
      message: error.message 
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
    let company = await Companies.findById(companyId).populate('jobPosts');
    
    if (!company) {
      // If not found as a company, check if this is a user with company account type
      const { default: Users } = await import("../models/userModel.js");
      const user = await Users.findById({ _id: companyId });
      
      if (user && user.accountType === "company") {
        // Look for a company with the same email as the user
        company = await Companies.findOne({ email: user.email }).populate('jobPosts');
      }
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found"
        });
      }
    }

    // Calculate stats
    const totalJobs = company.jobPosts.length;
    const activeJobs = company.jobPosts.filter(job => job.status === 'active').length;
    
    // Get total applications across all jobs - use company._id for the query
    const allJobs = await Jobs.find({ company: company._id });
    const totalApplications = allJobs.reduce((total, job) => total + (job.application?.length || 0), 0);
    
    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentApplications = allJobs.reduce((total, job) => {
      const recentJobApplications = job.application?.filter(app => 
        new Date(app.createdAt) > thirtyDaysAgo
      ) || [];
      return total + recentJobApplications.length;
    }, 0);

    const stats = {
      totalJobs,
      activeJobs,
      totalApplications,
      recentApplications,
      companyAge: company.foundedYear ? new Date().getFullYear() - company.foundedYear : 0,
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
      message: error.message 
    });
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (company) => {
  const fields = ['name', 'email', 'contact', 'location', 'about', 'industry', 'companySize', 'website'];
  const filledFields = fields.filter(field => company[field] && company[field].toString().trim() !== '');
  return Math.round((filledFields.length / fields.length) * 100);
};
