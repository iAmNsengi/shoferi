import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobAPI } from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobById(jobId);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch job details";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobAPI.applyForJob(jobId);
      toast.success("Application submitted successfully!");
      return { jobId, application: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to apply for job";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchNearbyJobs = createAsyncThunk(
  "jobs/fetchNearbyJobs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getNearbyJobs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch nearby jobs"
      );
    }
  }
);

export const fetchJobsByCategory = createAsyncThunk(
  "jobs/fetchJobsByCategory",
  async ({ category, params }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobsByCategory(category, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs by category"
      );
    }
  }
);

export const fetchJobCategories = createAsyncThunk(
  "jobs/fetchJobCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobCategories();
      return response.data.categories || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch categories";
      return rejectWithValue(message);
    }
  }
);

export const smartJobMatch = createAsyncThunk(
  "jobs/smartJobMatch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobAPI.smartJobMatch();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Smart matching failed"
      );
    }
  }
);

export const trackJobView = createAsyncThunk(
  "jobs/trackJobView",
  async (jobId, { rejectWithValue }) => {
    try {
      await jobAPI.trackJobView(jobId);
      return jobId;
    } catch (error) {
      // Don't show error toast for view tracking
      return rejectWithValue(
        error.response?.data?.message || "Failed to track view"
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobAPI.createJob(jobData);
      toast.success("Job created successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create job";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, updates }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.updateJob(jobId, updates);
      toast.success("Job updated successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update job";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await jobAPI.deleteJob(jobId);
      toast.success("Job deleted successfully!");
      return jobId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete job";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  "jobs/fetchUserApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getUserApplications();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    nearbyJobs: [],
    jobsByCategory: [],
    categories: [],
    smartMatches: [],
    currentJob: null,
    userApplications: [],
    loading: false,
    nearbyLoading: false,
    categoryLoading: false,
    smartMatchLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false,
    },
    filters: {
      category: "",
      jtype: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      experience: "",
      vehicleType: "",
      sort: "newest",
    },
    searchQuery: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        jtype: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        experience: "",
        vehicleType: "",
        sort: "newest",
      };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearNearbyJobs: (state) => {
      state.nearbyJobs = [];
    },
    clearSmartMatches: (state) => {
      state.smartMatches = [];
    },
    resetJobs: (state) => {
      state.jobs = [];
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the actual backend response structure
        state.jobs = action.payload.data || action.payload.jobs || [];
        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.numOfPage || 1,
          total: action.payload.totalJobs || 0,
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the actual backend response structure
        state.currentJob =
          action.payload.data || action.payload.job || action.payload;
        state.error = null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply for job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        // Update current job if it matches
        if (state.currentJob && state.currentJob._id === action.payload.jobId) {
          state.currentJob.hasApplied = true;
          if (!state.currentJob.applications) {
            state.currentJob.applications = [];
          }
          state.currentJob.applications.push(action.payload.application);
          state.currentJob.applicationCount =
            (state.currentJob.applicationCount || 0) + 1;
        }
        // Update job in jobs list if it exists
        const jobIndex = state.jobs.findIndex(
          (job) => job._id === action.payload.jobId
        );
        if (jobIndex !== -1) {
          state.jobs[jobIndex].hasApplied = true;
          state.jobs[jobIndex].applicationCount =
            (state.jobs[jobIndex].applicationCount || 0) + 1;
        }
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch nearby jobs
      .addCase(fetchNearbyJobs.pending, (state) => {
        state.nearbyLoading = true;
      })
      .addCase(fetchNearbyJobs.fulfilled, (state, action) => {
        state.nearbyLoading = false;
        state.nearbyJobs = action.payload.jobs;
      })
      .addCase(fetchNearbyJobs.rejected, (state, action) => {
        state.nearbyLoading = false;
        state.error = action.payload;
      })
      // Fetch jobs by category
      .addCase(fetchJobsByCategory.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(fetchJobsByCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.jobsByCategory = action.payload.jobs;
      })
      .addCase(fetchJobsByCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
      })
      // Smart job matching
      .addCase(smartJobMatch.pending, (state) => {
        state.smartMatchLoading = true;
      })
      .addCase(smartJobMatch.fulfilled, (state, action) => {
        state.smartMatchLoading = false;
        state.smartMatches = action.payload.jobs;
      })
      .addCase(smartJobMatch.rejected, (state, action) => {
        state.smartMatchLoading = false;
        state.error = action.payload;
      })
      // Track job view
      .addCase(trackJobView.fulfilled, (state, action) => {
        // Update view count if current job matches
        if (state.currentJob && state.currentJob._id === action.payload) {
          if (!state.currentJob.analytics) {
            state.currentJob.analytics = { views: 0 };
          }
          state.currentJob.analytics.views =
            (state.currentJob.analytics.views || 0) + 1;
        }
      })
      // Create job
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload.job);
      })
      // Update job
      .addCase(updateJob.fulfilled, (state, action) => {
        const jobIndex = state.jobs.findIndex(
          (job) => job._id === action.payload.job._id
        );
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = action.payload.job;
        }
        if (
          state.currentJob &&
          state.currentJob._id === action.payload.job._id
        ) {
          state.currentJob = action.payload.job;
        }
      })
      // Delete job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob = null;
        }
      })
      // Fetch user applications
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.userApplications = action.payload.applications;
      })
      // Fetch job categories
      .addCase(fetchJobCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchJobCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setSearchQuery,
  clearCurrentJob,
  clearNearbyJobs,
  clearSmartMatches,
  resetJobs,
} = jobSlice.actions;

export default jobSlice.reducer;
