import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyAPI } from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const getCompanyProfile = createAsyncThunk(
  "company/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getProfile();
      return response.data.data || response.data.company;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company profile"
      );
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  "company/updateProfile",
  async (updates, { rejectWithValue }) => {
    try {
      const response = await companyAPI.updateProfile(updates);
      toast.success("Company profile updated successfully!");
      return response.data.company || response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getCompanyJobs = createAsyncThunk(
  "company/getJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getJobs();
      return response.data.companies || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company jobs"
      );
    }
  }
);

export const getCompanyStats = createAsyncThunk(
  "company/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getStats();
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company stats"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    profile: null,
    jobs: [],
    stats: null,
    loading: false,
    error: null,
    actionLoading: {
      profile: false,
      jobs: false,
      stats: false,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearStats: (state) => {
      state.stats = null;
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get company profile
      .addCase(getCompanyProfile.pending, (state) => {
        state.loading = true;
        state.actionLoading.profile = true;
      })
      .addCase(getCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.actionLoading.profile = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.actionLoading.profile = false;
        state.error = action.payload;
      })
      // Update company profile
      .addCase(updateCompanyProfile.pending, (state) => {
        state.actionLoading.profile = true;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.actionLoading.profile = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.actionLoading.profile = false;
        state.error = action.payload;
      })
      // Get company jobs
      .addCase(getCompanyJobs.pending, (state) => {
        state.actionLoading.jobs = true;
      })
      .addCase(getCompanyJobs.fulfilled, (state, action) => {
        state.actionLoading.jobs = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(getCompanyJobs.rejected, (state, action) => {
        state.actionLoading.jobs = false;
        state.error = action.payload;
      })
      // Get company stats
      .addCase(getCompanyStats.pending, (state) => {
        state.actionLoading.stats = true;
      })
      .addCase(getCompanyStats.fulfilled, (state, action) => {
        state.actionLoading.stats = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getCompanyStats.rejected, (state, action) => {
        state.actionLoading.stats = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setProfile, clearStats, clearJobs } = companySlice.actions;
export default companySlice.reducer; 