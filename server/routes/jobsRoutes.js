import express from "express";
import userAuth from "../middlewares/authMiddleware.js";

import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobs,
  updateJob,
  applyJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  getNearbyJobs,
  getJobsByCategory,
  smartJobMatching,
  getJobCategories,
  trackJobView,
} from "../controllers/jobController.js";

const router = express.Router();

// POST || CREATE JOB
router.post("/upload-job", userAuth, createJob);

// GET || JOBS
router.get("/find-jobs", getJobs);

// GET || GET JOB BY ID
router.get("/get-job-detail/:jobId", getJobById);

// GET || GET JOB APPLICATIONS
router.get("/get-job-applications/:jobId", userAuth, getJobApplications);

// GET || GET USER APPLICATIONS
router.get("/get-user-applications", userAuth, getUserApplications);

// UPDATE || UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// DELETE || DELETE JOB
router.delete("/delete-job/:jobId", userAuth, deleteJobPost);

// POST || APPLY FOR JOB
router.post("/apply-job/:jobId", userAuth, applyJob);

// PUT || UPDATE APPLICATION STATUS
router.put(
  "/application-status/:applicationId",
  userAuth,
  updateApplicationStatus
);

// NEW ENDPOINTS FOR ENHANCED FUNCTIONALITY

// GET || NEARBY JOBS (location-based)
router.get("/nearby", getNearbyJobs);

// GET || JOBS BY CATEGORY
router.get("/category/:category", getJobsByCategory);

// GET || JOB CATEGORIES WITH STATS
router.get("/categories", getJobCategories);

// POST || SMART JOB MATCHING
router.post("/smart-match", userAuth, smartJobMatching);

// POST || TRACK JOB VIEW
router.post("/:jobId/view", trackJobView);

export default router;
