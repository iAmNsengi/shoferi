import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

// POST JOB
router.post("/add", userAuth, createJob);

// UPDATE JOB
router.put("/update/:jobId", userAuth, updateJob);

// GET JOB POST
router.get("/", getJobPosts);
router.get("/details/:id", getJobById);

// DELETE JOB POST
router.delete("/delete/:id", userAuth, deleteJobPost);

export default router;
