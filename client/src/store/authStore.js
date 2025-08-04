import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false, // Track if store has been initialized

      // Actions
      setUser: (user) => {
        console.log("Setting user:", user);
        set({ user, isAuthenticated: !!user });
      },
      setToken: (token) => {
        console.log("Setting token:", token ? "present" : "null");
        set({ token, isAuthenticated: !!token });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      login: (userData, token) => {
        console.log("Login called with:", {
          userData,
          token: token ? "present" : "null",
        });
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        console.log("Logout called");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData) => {
        console.log("Updating user:", userData);
        set((state) => ({
          ...state,
          user: userData,
        }));
      },

      // Getters
      getAuthHeaders: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      // Debug method
      getState: () => {
        const state = get();
        console.log("Current auth state:", {
          user: state.user ? "present" : "null",
          token: state.token ? "present" : "null",
          isAuthenticated: state.isAuthenticated,
          isLoading: state.isLoading,
          isInitialized: state.isInitialized,
        });
        return state;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Auth store rehydrated:", state);
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);

export default useAuthStore;
