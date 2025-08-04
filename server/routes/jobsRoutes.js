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
router.get("/", getJobs);

// GET || GET USER APPLICATIONS
router.get("/user/applications", userAuth, getUserApplications);

// GET || NEARBY JOBS (location-based)
router.get("/nearby", getNearbyJobs);

// GET || JOB CATEGORIES WITH STATS
router.get("/categories", getJobCategories);

// GET || GET JOB BY ID
router.get("/:jobId", getJobById);

// GET || GET JOB APPLICATIONS
router.get("/:jobId/applications", userAuth, getJobApplications);

// UPDATE || UPDATE JOB
router.put("/:jobId", userAuth, updateJob);

// DELETE || DELETE JOB
router.delete("/:jobId", userAuth, deleteJobPost);

// POST || APPLY FOR JOB
router.post("/:jobId/apply", userAuth, applyJob);

// PUT || UPDATE APPLICATION STATUS
router.put("/:applicationId/status", userAuth, updateApplicationStatus);

// GET || JOBS BY CATEGORY
router.get("/category/:category", getJobsByCategory);

// POST || SMART JOB MATCHING
router.post("/smart-match", userAuth, smartJobMatching);

// POST || TRACK JOB VIEW
router.post("/:jobId/view", trackJobView);

export default router;
