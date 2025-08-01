import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  authAPI,
  jobsAPI,
  companiesAPI,
  driversAPI,
  bookingsAPI,
  messagesAPI,
  notificationsAPI,
  paymentsAPI,
  adminAPI,
} from "../services/api";

// Auth Queries
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      toast.success("Login successful!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      toast.success("Registration successful!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: authAPI.getProfile,
    enabled: !!localStorage.getItem("auth-storage"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => authAPI.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Profile update failed");
    },
  });
};

// Jobs Queries
export const useJobs = (params = {}) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => jobsAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJob = (id) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => jobsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsAPI.create,
    onSuccess: () => {
      toast.success("Job created successfully!");
      queryClient.invalidateQueries(["jobs"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create job");
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => jobsAPI.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries(["jobs"]);
      queryClient.invalidateQueries(["jobs", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update job");
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsAPI.delete,
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries(["jobs"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete job");
    },
  });
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => jobsAPI.apply(id, data),
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries(["jobs"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    },
  });
};

// Companies Queries
export const useCompanies = (params = {}) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => companiesAPI.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompany = (id) => {
  return useQuery({
    queryKey: ["companies", id],
    queryFn: () => companiesAPI.getById(id),
    enabled: !!id,
  });
};

// Drivers Queries
export const useDrivers = (params = {}) => {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: () => driversAPI.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDriver = (id) => {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: () => driversAPI.getById(id),
    enabled: !!id,
  });
};

export const useDriverProfile = () => {
  return useQuery({
    queryKey: ["drivers", "profile"],
    queryFn: driversAPI.getProfile,
    enabled: !!localStorage.getItem("auth-storage"),
  });
};

// Bookings Queries
export const useBookings = (params = {}) => {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingsAPI.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time updates
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["bookings", "my-bookings"],
    queryFn: bookingsAPI.getMyBookings,
    enabled: !!localStorage.getItem("auth-storage"),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsAPI.create,
    onSuccess: () => {
      toast.success("Booking created successfully!");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
};

// Messages Queries
export const useMessages = (params = {}) => {
  return useQuery({
    queryKey: ["messages", params],
    queryFn: () => messagesAPI.getAll(params),
    staleTime: 1 * 60 * 1000, // 1 minute for real-time chat
  });
};

export const useConversation = (userId) => {
  return useQuery({
    queryKey: ["messages", "conversation", userId],
    queryFn: () => messagesAPI.getConversation(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds for real-time chat
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesAPI.create,
    onSuccess: (_, { receiverId }) => {
      queryClient.invalidateQueries(["messages", "conversation", receiverId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });
};

// Notifications Queries
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsAPI.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsAPI.markAllAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

// Admin Queries
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminAPI.getDashboard,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminAPI.getStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminAPI.getUsers(params),
    staleTime: 5 * 60 * 1000,
  });
};
