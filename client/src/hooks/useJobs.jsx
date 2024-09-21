import { useState, useEffect } from "react";
import {
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
} from "../api/jobs";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all jobs
  const getJobs = async (params = {}) => {
    setLoading(true);
    try {
      const response = await fetchJobs(params);
      setJobs(response.data.data); // Assuming the response data is in `data.data`
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch a specific job by ID
  const getJobById = async (id) => {
    setLoading(true);
    try {
      const response = await fetchJobById(id);
      setJob(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Create a new job post
  const createNewJob = async (jobData) => {
    setLoading(true);
    try {
      const response = await createJob(jobData);
      setJobs((prevJobs) => [...prevJobs, response.data.job]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Update a job post
  const updateExistingJob = async (id, jobData) => {
    setLoading(true);
    try {
      const response = await updateJob(id, jobData);
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === id ? response.data.job : job))
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Delete a job post
  const deleteJobById = async (id) => {
    setLoading(true);
    try {
      await deleteJob(id);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Apply for a job
  const applyToJob = async (id, userId) => {
    setLoading(true);
    try {
      await applyForJob(id, userId);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    jobs,
    job,
    loading,
    error,
    getJobs,
    getJobById,
    createNewJob,
    updateExistingJob,
    deleteJobById,
    applyToJob,
  };
};
