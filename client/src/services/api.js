import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage")).state?.token
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Clear auth data and redirect to login
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
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

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post("/jobs", jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (id, applicationData) =>
    api.post(`/jobs/${id}/apply`, applicationData),
  getApplications: (id) => api.get(`/jobs/${id}/applications`),
};

// Companies API
export const companiesAPI = {
  getAll: (params) => api.get("/companies", { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (companyData) => api.post("/companies", companyData),
  update: (id, companyData) => api.put(`/companies/${id}`, companyData),
  delete: (id) => api.delete(`/companies/${id}`),
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
};

// Bookings API
export const bookingsAPI = {
  getAll: (params) => api.get("/bookings", { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post("/bookings", bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getMyBookings: () => api.get("/bookings/my-bookings"),
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
