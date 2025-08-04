import express from "express";
import {
  isAuthenticated,
  checkPermission,
  trackUsage,
} from "../middlewares/authMiddleware.js";

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

// Public routes
router.get("/", getJobs);
router.get("/nearby", getNearbyJobs);
router.get("/categories", getJobCategories);
router.get("/:jobId", getJobById);
router.get("/category/:category", getJobsByCategory);
router.post("/:jobId/view", trackJobView);

// Protected routes with tier-based permissions
router.post(
  "/upload-job",
  isAuthenticated,
  checkPermission("post_job"),
  trackUsage("post_job"),
  createJob
);
router.post(
  "/:jobId/apply",
  isAuthenticated,
  checkPermission("apply_job"),
  trackUsage("apply_job"),
  applyJob
);
router.post("/smart-match", isAuthenticated, smartJobMatching);

// User-specific routes
router.get("/user/applications", isAuthenticated, getUserApplications);

// Company-specific routes
router.get("/:jobId/applications", isAuthenticated, getJobApplications);
router.put("/:applicationId/status", isAuthenticated, updateApplicationStatus);
router.put("/:jobId", isAuthenticated, updateJob);
router.delete("/:jobId", isAuthenticated, deleteJobPost);

export default router;
