import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useLogin,
  useRegister,
  useProfile,
  useUpdateProfile,
} from "../hooks/useQueries";
import useAuthStore from "../store/authStore";
import { accountAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // New state for account tier and usage
  const [usageStats, setUsageStats] = useState(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Zustand store
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    setUser,
    setToken,
    setLoading,
    setInitialized,
    login: storeLogin,
    logout: storeLogout,
    updateUser: storeUpdateUser,
    getState,
  } = useAuthStore();

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing authentication...");

      // If we have a token but no user, try to fetch user profile
      if (token && !user && isInitialized) {
        console.log("Token exists but no user, fetching profile...");
        try {
          const response = await profileQuery.refetch();
          if (response.data?.user) {
            console.log("Profile fetched successfully:", response.data.user);
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Clear invalid token
          storeLogout();
        }
      }

      setIsAuthInitialized(true);
      setInitialized(true);
    };

    if (isInitialized) {
      initializeAuth();
    }
  }, [token, user, isInitialized, setUser, setInitialized, storeLogout]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("AuthContext state changed:", {
      user: user ? "present" : "null",
      token: token ? "present" : "null",
      isAuthenticated,
      isLoading,
      isInitialized,
      isAuthInitialized,
    });
  }, [
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    isAuthInitialized,
  ]);

  // Update user when profile query succeeds and we don't have user data
  useEffect(() => {
    if (profileQuery.data && !user && isInitialized) {
      console.log("Profile query succeeded, updating user:", profileQuery.data);
      setUser(profileQuery.data);
    }
  }, [profileQuery.data, user, setUser, isInitialized]);

  // Fetch usage stats when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && isAuthInitialized) {
      fetchUsageStats();
    }
  }, [isAuthenticated, user, isAuthInitialized]);

  const fetchUsageStats = async () => {
    if (!isAuthenticated) return;

    setIsLoadingUsage(true);
    try {
      const response = await accountAPI.getUsageStats();
      setUsageStats(response.data);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  const login = async (credentials) => {
    console.log("Login attempt with credentials:", credentials);
    setLoading(true);
    try {
      const response = await loginMutation.mutateAsync(credentials);
      console.log("Login response:", response);

      const { user: userData, token: authToken } = response.data || response;

      if (!userData || !authToken) {
        throw new Error("Invalid login response: missing user or token");
      }

      console.log("Calling storeLogin with:", { userData, authToken });
      storeLogin(userData, authToken);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["user"]);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    console.log("Register attempt with userData:", userData);
    setLoading(true);
    try {
      const response = await registerMutation.mutateAsync(userData);
      console.log("Register response:", response);

      const { user: newUser, token: authToken } = response;

      if (!newUser || !authToken) {
        throw new Error("Invalid register response: missing user or token");
      }

      console.log("Calling storeLogin with:", { newUser, authToken });
      storeLogin(newUser, authToken);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["user"]);

      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logout called");
    storeLogout();
    setUsageStats(null);
    queryClient.clear();
  };

  const updateUser = async (userData) => {
    try {
      const response = await updateProfileMutation.mutateAsync({
        data: userData,
      });
      storeUpdateUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // New methods for account management
  const deleteAccount = async (password) => {
    try {
      const response = await accountAPI.deleteAccount(password);
      logout();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUsageStats = () => {
    fetchUsageStats();
  };

  // Helper methods for tier-based features
  const canPerformAction = (action) => {
    if (!user) return false;

    // Admin can perform all actions
    if (user.accountType === "admin") return true;

    // Check if user can perform the action based on their tier
    return user.canPerformAction ? user.canPerformAction(action) : false;
  };

  const getTierLimits = (action) => {
    const limits = {
      post_job: {
        STARTER: "1 job per month",
        PRO: "10 jobs per month",
        ENTERPRISE: "Unlimited",
      },
      apply_job: {
        STARTER: "1 application per month",
        PRO: "10 applications per month",
        ENTERPRISE: "Unlimited",
      },
      create_post: {
        STARTER: "Not available",
        PRO: "Available",
        ENTERPRISE: "Available",
      },
      comment_post: {
        STARTER: "Not available",
        PRO: "Available",
        ENTERPRISE: "Available",
      },
    };

    return limits[action] || {};
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      !isAuthInitialized,
    isInitialized: isInitialized && isAuthInitialized,
    usageStats,
    isLoadingUsage,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    refreshUsageStats,
    canPerformAction,
    getTierLimits,
    profileQuery,
    getState, // Expose for debugging
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
