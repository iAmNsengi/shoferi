import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  getCompanies,
  getCompanyById,
  getCompanyJobListing,
  getCompanyProfile,
  getCompanyStats,
  getCompanyDashboard,
  getCompanyApplications,
  getCompanyJobAnalytics,
  bulkUpdateApplicationStatus,
  scheduleInterview,
  register,
  signIn,
  updateCompanyProfile,
} from "../controllers/companiesController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// REGISTER
router.post("/register", limiter, register);

// LOGIN
router.post("/login", limiter, signIn);

// GET DATA
router.get(
  "/get-company-profile",
  (req, res, next) => {
    console.log("🚀 Route handler: /get-company-profile accessed");
    next();
  },
  userAuth,
  getCompanyProfile
);
router.get("/get-company-job-listings", userAuth, getCompanyJobListing);
router.get("/stats", userAuth, getCompanyStats);
router.get("/get-companies", getCompanies);
router.get("/get-company/:id", getCompanyById);

// COMPANY DASHBOARD & ANALYTICS
router.get("/dashboard", userAuth, getCompanyDashboard);
router.get("/applications", userAuth, getCompanyApplications);
router.get("/analytics", userAuth, getCompanyJobAnalytics);

// APPLICATION MANAGEMENT
router.put("/applications/bulk-update", userAuth, bulkUpdateApplicationStatus);
router.post(
  "/applications/:applicationId/schedule-interview",
  userAuth,
  scheduleInterview
);

// UPDATE DATA
router.put("/update-company-profile", userAuth, updateCompanyProfile);

export default router;
