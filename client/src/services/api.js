import axios from "axios";

const API_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api-v1";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shoferi_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("shoferi_token");
      localStorage.removeItem("shoferi_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/get-user"),
  updateProfile: (userData) => api.put("/users/update-user", userData),
  updatePreferences: (preferences) => api.put("/users/preferences", { preferences }),
  updateNotifications: (notifications) => api.put("/users/notifications", { notifications }),
  updatePrivacy: (privacy) => api.put("/users/privacy", { privacy }),
  changePassword: (currentPassword, newPassword) => api.put("/users/change-password", { currentPassword, newPassword }),
  deactivateAccount: (reason) => api.put("/users/deactivate", { reason }),
  getStats: () => api.get("/users/stats"),
  uploadProfileImage: (imageData) => api.post("/upload", imageData),
};

// Driver API
export const driverAPI = {
  register: (driverData) => api.post("/drivers/register", driverData),
  getProfile: () => api.get("/drivers/profile"),
  updateProfile: (updates) => api.put("/drivers/profile", updates),
  toggleAvailability: () => api.post("/drivers/availability/toggle"),
  searchDrivers: (params) => api.get("/drivers/search", { params }),
  getAvailableDrivers: (params) => api.get("/drivers/available", { params }),
  updateLocation: (location) => api.put("/drivers/location", location),
  getStats: () => api.get("/drivers/stats"),
  getNearby: (params) => api.get("/drivers/nearby", { params }),
  smartMatch: (criteria) => api.post("/drivers/smart-match", criteria),
};

// Booking API
export const bookingAPI = {
  create: (bookingData) => api.post("/bookings/create", bookingData),
  getUserBookings: () => api.get("/bookings/user"),
  getDriverBookings: () => api.get("/bookings/driver"),
  updateStatus: (bookingId, status) =>
    api.put(`/bookings/${bookingId}/status`, { status }),
  addReview: (bookingId, reviewData) =>
    api.post(`/bookings/${bookingId}/review`, reviewData),
  getBookingDetails: (bookingId) => api.get(`/bookings/${bookingId}`),
};

// Job API
export const jobAPI = {
  getJobs: (params) => api.get("/jobs/find-jobs", { params }),
  getJobById: (jobId) => api.get(`/jobs/get-job-detail/${jobId}`),
  createJob: (jobData) => api.post("/jobs/upload-job", jobData),
  updateJob: (jobId, updates) => api.put(`/jobs/update-job/${jobId}`, updates),
  deleteJob: (jobId) => api.delete(`/jobs/delete-job/${jobId}`),
  applyForJob: (jobId) => api.post(`/jobs/apply-job/${jobId}`),
  getUserApplications: () => api.get("/jobs/get-user-applications"),
  getJobApplications: (jobId) => api.get(`/jobs/get-job-applications/${jobId}`),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/jobs/application-status/${applicationId}`, { status }),

  // Enhanced job functionality
  getNearbyJobs: (params) => api.get("/jobs/nearby", { params }),
  getJobsByCategory: (category, params) =>
    api.get(`/jobs/category/${category}`, { params }),
  getJobCategories: () => api.get("/jobs/categories"),
  smartJobMatch: () => api.post("/jobs/smart-match"),
  trackJobView: (jobId) => api.post(`/jobs/${jobId}/view`),
};

// Payment API
export const paymentAPI = {
  initiatePayment: (paymentData) => api.post("/payments/initiate", paymentData),
  getPaymentHistory: (params) => api.get("/payments/history", { params }),
  getDriverEarnings: (params) => api.get("/payments/earnings", { params }),
  refundPayment: (paymentId, reason) =>
    api.post(`/payments/${paymentId}/refund`, { reason }),
};

// Location utilities
export const locationUtils = {
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  },

  watchPosition: (callback) => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported");
    }

    return navigator.geolocation.watchPosition(
      callback,
      (error) => console.error("Location watch error:", error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  },

  clearWatch: (watchId) => {
    navigator.geolocation.clearWatch(watchId);
  },

  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  formatAddress: async (latitude, longitude) => {
    // This would use a geocoding service like Google Maps or OpenStreetMap
    // For demo purposes, return a formatted string
    return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  },
};

// Real-time utilities
export const realtimeUtils = {
  startLocationTracking: async (onLocationUpdate) => {
    try {
      const watchId = locationUtils.watchPosition((position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Update driver location on server
        driverAPI.updateLocation(location).catch(console.error);

        // Call callback with new location
        if (onLocationUpdate) {
          onLocationUpdate(location);
        }
      });

      return watchId;
    } catch (error) {
      console.error("Error starting location tracking:", error);
      throw error;
    }
  },

  stopLocationTracking: (watchId) => {
    if (watchId) {
      locationUtils.clearWatch(watchId);
    }
  },
};

// Notification utilities
export const notificationUtils = {
  requestPermission: async () => {
    if (!("Notification" in window)) {
      throw new Error("This browser does not support notifications");
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  },

  showNotification: (title, options = {}) => {
    if (Notification.permission === "granted") {
      return new Notification(title, {
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        ...options,
      });
    }
  },

  showBookingNotification: (booking) => {
    return notificationUtils.showNotification("New Booking Request", {
      body: `Pickup: ${booking.pickupLocation?.address}`,
      data: { bookingId: booking._id },
      requireInteraction: true,
    });
  },

  showJobNotification: (job) => {
    return notificationUtils.showNotification("New Job Opportunity", {
      body: `${job.jobTitle} - ${job.salary.toLocaleString()} RWF`,
      data: { jobId: job._id },
    });
  },
};

export default api;
