import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  authAPI,
  userAPI,
  jobsAPI,
  companiesAPI,
  driversAPI,
  bookingsAPI,
  messagesAPI,
  notificationsAPI,
  paymentsAPI,
  adminAPI,
  feedAPI,
  learningAPI,
  subscriptionsAPI,
  accountAPI,
} from "../services/api";
import useAuthStore from "../store/authStore";

// Auth Queries
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useProfile = () => {
  const { token, isInitialized } = useAuthStore();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: authAPI.getProfile,
    enabled: !!token && isInitialized, // Only run when we have a token and store is initialized
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

// User Profile Queries
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile", "detailed"],
    queryFn: userAPI.getProfile,
    enabled: !!localStorage.getItem("auth-storage"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["user", "profile", "detailed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Profile update failed");
    },
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updatePreferences,
    onSuccess: () => {
      toast.success("Preferences updated successfully!");
      queryClient.invalidateQueries(["user", "profile", "detailed"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update preferences"
      );
    },
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateNotificationSettings,
    onSuccess: () => {
      toast.success("Notification settings updated successfully!");
      queryClient.invalidateQueries(["user", "profile", "detailed"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update notification settings"
      );
    },
  });
};

export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updatePrivacySettings,
    onSuccess: () => {
      toast.success("Privacy settings updated successfully!");
      queryClient.invalidateQueries(["user", "profile", "detailed"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update privacy settings"
      );
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userAPI.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });
};

export const useDeactivateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.deactivateAccount,
    onSuccess: () => {
      toast.success("Account deactivated successfully!");
      localStorage.removeItem("auth-storage");
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to deactivate account"
      );
    },
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ["user", "stats"],
    queryFn: userAPI.getUserStats,
    enabled: !!localStorage.getItem("auth-storage"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.uploadProfileImage,
    onSuccess: () => {
      toast.success("Profile image uploaded successfully!");
      queryClient.invalidateQueries(["user", "profile", "detailed"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to upload profile image"
      );
    },
  });
};

export const useUploadCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.uploadCV,
    onSuccess: () => {
      toast.success("CV uploaded successfully!");
      queryClient.invalidateQueries(["user", "profile", "detailed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload CV");
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

export const useNearbyJobs = (params = {}) => {
  return useQuery({
    queryKey: ["jobs", "nearby", params],
    queryFn: () => jobsAPI.getNearby(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for location-based data
  });
};

export const useJobsByCategory = (category, params = {}) => {
  return useQuery({
    queryKey: ["jobs", "category", category, params],
    queryFn: () => jobsAPI.getByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJobCategories = () => {
  return useQuery({
    queryKey: ["jobs", "categories"],
    queryFn: () => jobsAPI.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    mutationFn: ({ jobId, applicationData }) =>
      jobsAPI.apply(jobId, applicationData),
    onSuccess: () => {
      toast.success("Job application submitted successfully!");
      queryClient.invalidateQueries(["jobs"]);
      queryClient.invalidateQueries(["user-applications"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to apply for job");
    },
  });
};

export const useUserApplications = (params = {}) => {
  return useQuery({
    queryKey: ["user-applications", params],
    queryFn: () => jobsAPI.getUserApplications(params),
    enabled: !!localStorage.getItem("auth-storage"),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, data }) =>
      jobsAPI.updateApplicationStatus(applicationId, data),
    onSuccess: () => {
      toast.success("Application status updated successfully!");
      queryClient.invalidateQueries(["user-applications"]);
      queryClient.invalidateQueries(["jobs"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    },
  });
};

export const useTrackJobView = () => {
  return useMutation({
    mutationFn: jobsAPI.trackView,
    onError: (error) => {
      console.error("Failed to track job view:", error);
    },
  });
};

export const useSmartJobMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsAPI.smartMatch,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      toast.success("Smart job matching completed!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to find matching jobs"
      );
    },
  });
};

export const useTrackProfileView = () => {
  return useMutation({
    mutationFn: ({ driverId, source }) =>
      driversAPI.trackProfileView(driverId, source),
    onError: (error) => {
      console.error("Failed to track profile view:", error);
    },
  });
};

export const useProfileViews = (driverId, period = "30d") => {
  return useQuery({
    queryKey: ["profile-views", driverId, period],
    queryFn: () => driversAPI.getProfileViews(driverId, period),
    enabled: !!driverId && !!localStorage.getItem("auth-storage"),
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export const useDriverStats = () => {
  return useQuery({
    queryKey: ["drivers", "stats"],
    queryFn: driversAPI.getStats,
    enabled: !!localStorage.getItem("auth-storage"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: driversAPI.toggleAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries(["drivers", "profile"]);
      queryClient.invalidateQueries(["drivers", "stats"]);
      toast.success("Availability updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    },
  });
};

export const useUpdateDriverLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: driversAPI.updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(["drivers", "profile"]);
    },
    onError: (error) => {
      console.error("Failed to update location:", error);
    },
  });
};

export const useNearbyDrivers = (params = {}) => {
  return useQuery({
    queryKey: ["drivers", "nearby", params],
    queryFn: () => driversAPI.getNearby(params),
    staleTime: 30 * 1000, // 30 seconds for real-time location
  });
};

export const useSearchDrivers = (params = {}) => {
  return useQuery({
    queryKey: ["drivers", "search", params],
    queryFn: () => driversAPI.search(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAvailableDrivers = (params = {}) => {
  return useQuery({
    queryKey: ["drivers", "available", params],
    queryFn: () => driversAPI.getAvailable(params),
    staleTime: 1 * 60 * 1000, // 1 minute for real-time availability
  });
};

export const useSmartDriverMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: driversAPI.smartMatch,
    onSuccess: () => {
      queryClient.invalidateQueries(["drivers", "available"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to find matching drivers"
      );
    },
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

export const useDriverBookings = () => {
  return useQuery({
    queryKey: ["bookings", "driver"],
    queryFn: bookingsAPI.getDriverBookings,
    enabled: !!localStorage.getItem("auth-storage"),
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time updates
  });
};

export const useUserBookings = () => {
  return useQuery({
    queryKey: ["bookings", "user"],
    queryFn: bookingsAPI.getUserBookings,
    enabled: !!localStorage.getItem("auth-storage"),
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time updates
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }) =>
      bookingsAPI.updateStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking status updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
    },
  });
};

export const useAddBookingReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, review }) =>
      bookingsAPI.addReview(bookingId, review),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Review added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add review");
    },
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

// Company Dashboard & Analytics
export const useCompanyDashboard = () => {
  const { token, isInitialized } = useAuthStore();
  return useQuery({
    queryKey: ["company-dashboard"],
    queryFn: companiesAPI.getDashboard,
    enabled: !!token && isInitialized,
  });
};

export const useCompanyApplications = (params = {}) => {
  const { token, isInitialized } = useAuthStore();
  return useQuery({
    queryKey: ["company-applications", params],
    queryFn: () => companiesAPI.getApplications(params),
    enabled: !!token && isInitialized,
  });
};

export const useCompanyAnalytics = (params = {}) => {
  const { token, isInitialized } = useAuthStore();
  return useQuery({
    queryKey: ["company-analytics", params],
    queryFn: () => companiesAPI.getAnalytics(params),
    enabled: !!token && isInitialized,
  });
};

// Company Application Management
export const useBulkUpdateApplications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companiesAPI.bulkUpdateApplications,
    onSuccess: () => {
      queryClient.invalidateQueries(["company-applications"]);
      queryClient.invalidateQueries(["company-dashboard"]);
    },
  });
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, data }) =>
      companiesAPI.scheduleInterview(applicationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["company-applications"]);
      queryClient.invalidateQueries(["company-dashboard"]);
    },
  });
};

// Feed Queries
export const useFeedPosts = (params = {}) => {
  return useQuery({
    queryKey: ["feed", params],
    queryFn: () => feedAPI.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for social feed
  });
};

export const useFeedPost = (id) => {
  return useQuery({
    queryKey: ["feed", id],
    queryFn: () => feedAPI.getById(id),
    enabled: !!id,
  });
};

export const useTrendingPosts = (params = {}) => {
  return useQuery({
    queryKey: ["feed", "trending", params],
    queryFn: () => feedAPI.getTrending(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserPosts = (userId, params = {}) => {
  return useQuery({
    queryKey: ["feed", "user", userId, params],
    queryFn: () => feedAPI.getUserPosts(userId, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedAPI.create,
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries(["feed"]);
      queryClient.invalidateQueries(["feed", "trending"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => feedAPI.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries(["feed"]);
      queryClient.invalidateQueries(["feed", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedAPI.delete,
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
    },
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedAPI.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to like post");
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentData }) =>
      feedAPI.addComment(postId, commentData),
    onSuccess: () => {
      toast.success("Comment added successfully!");
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add comment");
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId, replyData }) =>
      feedAPI.addReply(postId, commentId, replyData),
    onSuccess: () => {
      toast.success("Reply added successfully!");
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add reply");
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }) =>
      feedAPI.deleteComment(postId, commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
  });
};

// Learning Queries
export const useLearningMaterials = (params = {}) => {
  return useQuery({
    queryKey: ["learning", params],
    queryFn: () => learningAPI.getAll(params),
    staleTime: 10 * 60 * 1000, // 10 minutes for learning content
  });
};

export const useLearningMaterial = (id) => {
  return useQuery({
    queryKey: ["learning", id],
    queryFn: () => learningAPI.getById(id),
    enabled: !!id,
  });
};

export const useFeaturedLearning = (params = {}) => {
  return useQuery({
    queryKey: ["learning", "featured", params],
    queryFn: () => learningAPI.getFeatured(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLearningByCategory = (category, params = {}) => {
  return useQuery({
    queryKey: ["learning", "category", category, params],
    queryFn: () => learningAPI.getByCategory(category, params),
    enabled: !!category,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLearningStats = () => {
  return useQuery({
    queryKey: ["learning", "stats"],
    queryFn: () => learningAPI.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateLearning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: learningAPI.create,
    onSuccess: () => {
      toast.success("Learning material created successfully!");
      queryClient.invalidateQueries(["learning"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create learning material"
      );
    },
  });
};

export const useUpdateLearning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => learningAPI.update(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Learning material updated successfully!");
      queryClient.invalidateQueries(["learning"]);
      queryClient.invalidateQueries(["learning", id]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update learning material"
      );
    },
  });
};

export const useDeleteLearning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: learningAPI.delete,
    onSuccess: () => {
      toast.success("Learning material deleted successfully!");
      queryClient.invalidateQueries(["learning"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete learning material"
      );
    },
  });
};

export const useToggleLearningPublish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: learningAPI.togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries(["learning"]);
      toast.success("Learning material publish status updated!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update publish status"
      );
    },
  });
};

export const useToggleLearningFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: learningAPI.toggleFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries(["learning"]);
      queryClient.invalidateQueries(["learning", "featured"]);
      toast.success("Learning material featured status updated!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update featured status"
      );
    },
  });
};

// Subscription Queries
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscriptions", "plans"],
    queryFn: () => subscriptionsAPI.getPlans(),
    staleTime: 30 * 60 * 1000, // 30 minutes for plans
  });
};

export const useCurrentSubscription = () => {
  const { token, isInitialized } = useAuthStore();

  return useQuery({
    queryKey: ["subscriptions", "current"],
    queryFn: () => subscriptionsAPI.getCurrentSubscription(),
    enabled: !!token && isInitialized,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: subscriptionsAPI.createCheckoutSession,
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create checkout session"
      );
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionsAPI.cancelSubscription,
    onSuccess: () => {
      toast.success("Subscription cancelled successfully!");
      queryClient.invalidateQueries(["subscriptions", "current"]);
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    },
  });
};

export const useReactivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionsAPI.reactivateSubscription,
    onSuccess: () => {
      toast.success("Subscription reactivated successfully!");
      queryClient.invalidateQueries(["subscriptions", "current"]);
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reactivate subscription"
      );
    },
  });
};

// Account Management Queries
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountAPI.deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted successfully!");
      localStorage.removeItem("auth-storage");
      queryClient.clear();
      window.location.href = "/";
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
    },
  });
};

export const useUsageStats = () => {
  const { token, isInitialized } = useAuthStore();

  return useQuery({
    queryKey: ["account", "stats"],
    queryFn: () => accountAPI.getUsageStats(),
    enabled: !!token && isInitialized,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpgradeAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountAPI.upgradeAccount,
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upgrade account");
    },
  });
};
