import API from ".";

// Fetch job posts with filters, pagination, etc.
export const fetchJobs = (params) => API.get("/jobs", { params });

// Fetch a specific job by its ID
export const fetchJobById = (id) => API.get(`/jobs/details/${id}`);

// Create a new job post
export const createJob = (jobData) => API.post("/jobs", jobData);

// Update an existing job post
export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);

// Delete a job post by its ID
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Apply for a job
export const applyForJob = (id, userId) =>
  API.post(`/jobs/${id}/apply`, { userId });
