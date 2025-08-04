import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useLogin,
  useRegister,
  useProfile,
  useUpdateProfile,
} from "../hooks/useQueries";
import useAuthStore from "../store/authStore";

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
    login: storeLogin,
    logout: storeLogout,
    updateUser: storeUpdateUser,
    getState,
  } = useAuthStore();

  // Debug: Log state changes
  useEffect(() => {
    console.log("AuthContext state changed:", {
      user: user ? "present" : "null",
      token: token ? "present" : "null",
      isAuthenticated,
      isLoading,
      isInitialized,
    });
  }, [user, token, isAuthenticated, isLoading, isInitialized]);

  // Update user when profile query succeeds and we don't have user data
  useEffect(() => {
    if (profileQuery.data && !user && isInitialized) {
      console.log("Profile query succeeded, updating user:", profileQuery.data);
      setUser(profileQuery.data);
    }
  }, [profileQuery.data, user, setUser, isInitialized]);

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

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,
    isInitialized,
    login,
    register,
    logout,
    updateUser,
    profileQuery,
    getState, // Expose for debugging
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
