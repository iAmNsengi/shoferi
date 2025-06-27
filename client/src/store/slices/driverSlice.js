import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { driverAPI } from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const registerDriver = createAsyncThunk(
  "driver/register",
  async (driverData, { rejectWithValue }) => {
    try {
      const response = await driverAPI.register(driverData);
      toast.success("Driver profile created successfully!");
      return response.data.driver;
    } catch (error) {
      const message =
        error.response?.data?.message || "Driver registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchDriverProfile = createAsyncThunk(
  "driver/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await driverAPI.getProfile();
      return response.data.driver;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateDriverProfile = createAsyncThunk(
  "driver/updateProfile",
  async (updates, { rejectWithValue }) => {
    try {
      const response = await driverAPI.updateProfile(updates);
      toast.success("Profile updated successfully!");
      return response.data.driver;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const toggleAvailability = createAsyncThunk(
  "driver/toggleAvailability",
  async (_, { rejectWithValue }) => {
    try {
      const response = await driverAPI.toggleAvailability();
      toast.success(`Status changed to ${response.data.status}`);
      return response.data.status;
    } catch (error) {
      const message = error.response?.data?.message || "Status update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const searchDrivers = createAsyncThunk(
  "driver/search",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await driverAPI.searchDrivers(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

export const fetchAvailableDrivers = createAsyncThunk(
  "driver/fetchAvailable",
  async (params, { rejectWithValue }) => {
    try {
      const response = await driverAPI.getAvailableDrivers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drivers"
      );
    }
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState: {
    profile: null,
    availableDrivers: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
    searchError: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.searchError = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    updateLocation: (state, action) => {
      if (state.profile) {
        state.profile.currentLocation = action.payload;
      }
    },
    setAvailabilityStatus: (state, action) => {
      if (state.profile) {
        state.profile.availability.status = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register driver
      .addCase(registerDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(registerDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch profile
      .addCase(fetchDriverProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDriverProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchDriverProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateDriverProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDriverProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateDriverProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle availability
      .addCase(toggleAvailability.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.availability.status = action.payload;
        }
      })
      // Search drivers
      .addCase(searchDrivers.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchDrivers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.drivers;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(searchDrivers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })
      // Fetch available drivers
      .addCase(fetchAvailableDrivers.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(fetchAvailableDrivers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.availableDrivers = action.payload.drivers;
      })
      .addCase(fetchAvailableDrivers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  updateLocation,
  setAvailabilityStatus,
} = driverSlice.actions;
export default driverSlice.reducer;
