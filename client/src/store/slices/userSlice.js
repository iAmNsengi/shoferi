import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (updates, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(updates);
      toast.success("Profile updated successfully!");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  "user/updatePreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await userAPI.updatePreferences(preferences);
      toast.success("Preferences updated successfully!");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  "user/updateNotifications",
  async (notifications, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateNotifications(notifications);
      toast.success("Notification settings updated!");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updatePrivacySettings = createAsyncThunk(
  "user/updatePrivacy",
  async (privacy, { rejectWithValue }) => {
    try {
      const response = await userAPI.updatePrivacy(privacy);
      toast.success("Privacy settings updated!");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await userAPI.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deactivateAccount = createAsyncThunk(
  "user/deactivateAccount",
  async (reason, { rejectWithValue }) => {
    try {
      const response = await userAPI.deactivateAccount(reason);
      toast.success("Account deactivated successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Deactivation failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "user/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getStats();
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    stats: null,
    loading: false,
    error: null,
    preferences: {
      language: "en",
      currency: "RWF",
      theme: "light",
      timezone: "Africa/Kigali",
      notifications: {
        email: true,
        sms: true,
        push: true,
        jobAlerts: true,
        marketing: false,
      },
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        showLocation: true,
      },
    },
    actionLoading: {
      preferences: false,
      notifications: false,
      privacy: false,
      password: false,
      deactivate: false,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearStats: (state) => {
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        if (action.payload.preferences) {
          state.preferences = {
            ...state.preferences,
            ...action.payload.preferences,
          };
        }
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        if (action.payload.preferences) {
          state.preferences = {
            ...state.preferences,
            ...action.payload.preferences,
          };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.actionLoading.preferences = true;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.actionLoading.preferences = false;
        state.profile = action.payload;
        if (action.payload.preferences) {
          state.preferences = {
            ...state.preferences,
            ...action.payload.preferences,
          };
        }
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.actionLoading.preferences = false;
        state.error = action.payload;
      })
      // Update notifications
      .addCase(updateNotificationSettings.pending, (state) => {
        state.actionLoading.notifications = true;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.actionLoading.notifications = false;
        state.profile = action.payload;
        if (action.payload.preferences?.notifications) {
          state.preferences.notifications = {
            ...state.preferences.notifications,
            ...action.payload.preferences.notifications,
          };
        }
        state.error = null;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.actionLoading.notifications = false;
        state.error = action.payload;
      })
      // Update privacy
      .addCase(updatePrivacySettings.pending, (state) => {
        state.actionLoading.privacy = true;
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.actionLoading.privacy = false;
        state.profile = action.payload;
        if (action.payload.preferences?.privacy) {
          state.preferences.privacy = {
            ...state.preferences.privacy,
            ...action.payload.preferences.privacy,
          };
        }
        state.error = null;
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.actionLoading.privacy = false;
        state.error = action.payload;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.actionLoading.password = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.actionLoading.password = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.actionLoading.password = false;
        state.error = action.payload;
      })
      // Deactivate account
      .addCase(deactivateAccount.pending, (state) => {
        state.actionLoading.deactivate = true;
      })
      .addCase(deactivateAccount.fulfilled, (state) => {
        state.actionLoading.deactivate = false;
        state.error = null;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.actionLoading.deactivate = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError, updatePreferences, setProfile, clearStats } = userSlice.actions;
export default userSlice.reducer;
