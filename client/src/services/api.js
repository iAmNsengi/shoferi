import axios from "axios";
import useAuthStore from "../store/authStore";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      // Get token from Zustand store
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Adding auth header for request:", config.url);
      } else {
        console.log("No token found for request:", config.url);
      }
    } catch (error) {
      console.error("Error getting token from store:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 error received, logging out");
      // Clear auth data and redirect to login
      try {
        useAuthStore.getState().logout();
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } catch (e) {
        console.error("Error handling 401 response:", e);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/get-user"),
  updateProfile: (data) => api.put("/users/update-user", data),
  updatePreferences: (data) => api.put("/users/preferences", data),
  updateNotificationSettings: (data) => api.put("/users/notifications", data),
  updatePrivacySettings: (data) => api.put("/users/privacy", data),
  changePassword: (data) => api.put("/users/change-password", data),
  deactivateAccount: (data) => api.put("/users/deactivate", data),
  getUserStats: () => api.get("/users/stats"),
  uploadProfileImage: (formData) =>
    api.post("/upload/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadCV: (formData) =>
    api.post("/upload/cv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post("/jobs/upload-job", jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (id, applicationData) =>
    api.post(`/jobs/${id}/apply`, applicationData),
  getApplications: (id) => api.get(`/jobs/${id}/applications`),
  getUserApplications: (params) =>
    api.get("/jobs/user/applications", { params }),
  updateApplicationStatus: (applicationId, data) =>
    api.put(`/jobs/${applicationId}/status`, data),
  trackView: (jobId) => api.post(`/jobs/${jobId}/view`),
  // New endpoints
  getNearby: (params) => api.get("/jobs/nearby", { params }),
  getByCategory: (category, params) =>
    api.get(`/jobs/category/${category}`, { params }),
  getCategories: () => api.get("/jobs/categories"),
  smartMatch: (data) => api.post("/jobs/smart-match", data),
};

// Companies API
export const companiesAPI = {
  getAll: (params) => api.get("/companies", { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (companyData) => api.post("/companies", companyData),
  update: (id, companyData) => api.put(`/companies/${id}`, companyData),
  delete: (id) => api.delete(`/companies/${id}`),
  // Company Dashboard & Management
  getProfile: () => api.get("/companies/get-company-profile"),
  updateProfile: (data) => api.put("/companies/update-company-profile", data),
  getJobListings: () => api.get("/companies/get-company-job-listings"),
  getStats: () => api.get("/companies/stats"),
  getDashboard: () => api.get("/companies/dashboard"),
  getApplications: (params) => api.get("/companies/applications", { params }),
  getAnalytics: (params) => api.get("/companies/analytics", { params }),
  bulkUpdateApplications: (data) =>
    api.put("/companies/applications/bulk-update", data),
  scheduleInterview: (applicationId, data) =>
    api.post(
      `/companies/applications/${applicationId}/schedule-interview`,
      data
    ),
};

// Drivers API
export const driversAPI = {
  getAll: (params) => api.get("/drivers", { params }),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (driverData) => api.post("/drivers", driverData),
  update: (id, driverData) => api.put(`/drivers/${id}`, driverData),
  delete: (id) => api.delete(`/drivers/${id}`),
  getProfile: () => api.get("/drivers/profile"),
  updateProfile: (data) => api.put("/drivers/profile", data),
  getStats: () => api.get("/drivers/stats"),
  toggleAvailability: () => api.post("/drivers/availability/toggle"),
  updateLocation: (location) => api.put("/drivers/location", location),
  getNearby: (params) => api.get("/drivers/nearby", { params }),
  search: (params) => api.get("/drivers/search", { params }),
  getAvailable: (params) => api.get("/drivers/available", { params }),
  smartMatch: (data) => api.post("/drivers/smart-match", data),
  trackProfileView: (driverId, source) =>
    api.post(`/drivers/${driverId}/track-view`, { source }),
  getProfileViews: (driverId, period) =>
    api.get(`/drivers/${driverId}/profile-views`, { params: { period } }),
};

// Bookings API
export const bookingsAPI = {
  getAll: (params) => api.get("/bookings", { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post("/bookings", bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getMyBookings: () => api.get("/bookings/my-bookings"),
  getUserBookings: () => api.get("/bookings/user"),
  getDriverBookings: () => api.get("/bookings/driver"),
  updateStatus: (bookingId, status) =>
    api.put(`/bookings/${bookingId}/status`, { status }),
  addReview: (bookingId, review) =>
    api.post(`/bookings/${bookingId}/review`, review),
};

// Messages API
export const messagesAPI = {
  getAll: (params) => api.get("/messages", { params }),
  getById: (id) => api.get(`/messages/${id}`),
  create: (messageData) => api.post("/messages", messageData),
  update: (id, messageData) => api.put(`/messages/${id}`, messageData),
  delete: (id) => api.delete(`/messages/${id}`),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get("/notifications", { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/mark-all-read"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Payments API
export const paymentsAPI = {
  getAll: (params) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (paymentData) => api.post("/payments", paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get("/admin/stats"),
};

export default api;
